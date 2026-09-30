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
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) return response({ error: 'Function is not configured' }, 500)

  let payload: { name?: unknown; email?: unknown; message?: unknown; website?: unknown }
  try {
    payload = await request.json()
  } catch {
    return response({ error: 'Invalid message data' }, 400)
  }

  if (typeof payload.website === 'string' && payload.website.trim()) {
    return response({ ok: true })
  }

  if (
    typeof payload.name !== 'string' || payload.name.trim().length < 2 || payload.name.trim().length > 120
    || typeof payload.email !== 'string' || payload.email.trim().length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())
    || typeof payload.message !== 'string' || payload.message.trim().length < 1 || payload.message.trim().length > 5000
  ) {
    return response({ error: 'Check the name, email and message fields' }, 400)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { error } = await adminClient.from('contact_messages').insert({
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
  })

  if (error) {
    console.error('Could not save contact message:', error)
    return response({ error: 'Could not save your message' }, 500)
  }

  return response({ ok: true }, 201)
})