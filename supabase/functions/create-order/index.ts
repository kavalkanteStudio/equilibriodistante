import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return response({ error: 'Function is not configured' }, 500)
  }

  let customer: Record<string, unknown>
  let items: { variantId: string; quantity: number; expectedUnitPrice: number }[]
  try {
    const payload = await request.json()
    customer = payload.customer
    items = payload.items
  } catch {
    return response({ error: 'Invalid order data' }, 400)
  }

  const customerFields = ['fullName', 'email', 'address', 'city', 'zipCode']
  if (
    !customer || typeof customer !== 'object'
    || customerFields.some((field) => typeof customer[field] !== 'string' || !(customer[field] as string).trim())
  ) {
    return response({ error: 'Complete all customer information before placing the order' }, 400)
  }

  const email = (customer.email as string).trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response({ error: 'Enter a valid email address' }, 400)
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return response({ error: 'The order must contain between 1 and 50 items' }, 400)
  }

  const variantIds = new Set<string>()
  for (const item of items) {
    if (
      !item || typeof item.variantId !== 'string' || !/^[0-9a-f-]{36}$/i.test(item.variantId)
      || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
      || !Number.isFinite(item.expectedUnitPrice) || item.expectedUnitPrice < 0
      || variantIds.has(item.variantId)
    ) {
      return response({ error: 'The order contains an invalid item or quantity' }, 400)
    }
    variantIds.add(item.variantId)
  }

  const authorization = request.headers.get('Authorization')
  let customerId: string | null = null
  if (authorization?.startsWith('Bearer ')) {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
    })
    const { data } = await userClient.auth.getUser()
    customerId = data.user?.id ?? null
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: variants, error: variantsError } = await adminClient
    .from('product_variants')
    .select('id, products!inner(base_price, active)')
    .in('id', [...variantIds])

  if (variantsError) {
    console.error('Could not validate order variants:', variantsError)
    return response({ error: 'Could not validate the items in your order' }, 500)
  }

  const priceByVariant = new Map<string, number>()
  for (const variant of variants ?? []) {
    const product = variant.products as { base_price: number | string; active: boolean }
    const priceInCents = Math.round(Number(product.base_price) * 100)
    if (product.active && Number.isFinite(priceInCents) && priceInCents >= 0) {
      priceByVariant.set(variant.id, priceInCents)
    }
  }

  if (priceByVariant.size !== items.length) {
    return response({ error: 'One or more items are no longer available' }, 409)
  }

  if (items.some((item) => Math.round(item.expectedUnitPrice * 100) !== priceByVariant.get(item.variantId))) {
    return response({ error: 'An item price has changed. Refresh your cart and try again.' }, 409)
  }

  const orderTotalInCents = items.reduce(
    (total, item) => total + priceByVariant.get(item.variantId)! * item.quantity,
    0,
  )
  const { data: order, error: orderError } = await adminClient
    .from('orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      total_amount: orderTotalInCents / 100,
      shipping_reference: JSON.stringify({
        fullName: (customer.fullName as string).trim(),
        email,
        address: (customer.address as string).trim(),
        city: (customer.city as string).trim(),
        zipCode: (customer.zipCode as string).trim(),
      }),
    })
    .select('id')
    .single()

  if (orderError || !order) {
    console.error('Could not create order:', orderError)
    return response({ error: 'Could not save your order. Please try again.' }, 500)
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_variant_id: item.variantId,
    quantity: item.quantity,
    unit_price: priceByVariant.get(item.variantId)! / 100,
  }))
  const { error: itemsError } = await adminClient.from('order_items').insert(orderItems)

  if (itemsError) {
    console.error('Could not create order items:', itemsError)
    const { error: cleanupError } = await adminClient.from('orders').delete().eq('id', order.id)
    if (cleanupError) console.error('Could not remove incomplete order:', cleanupError)
    return response({ error: 'Could not save your order items. Please try again.' }, 500)
  }

  return response({ order_id: order.id }, 201)
})