import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MAX_IMAGE_BYTES = 12 * 1024 * 1024
const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

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

function isPrivateHost(hostname: string) {
  const normalized = hostname.toLowerCase()
  return normalized === 'localhost'
    || normalized === '127.0.0.1'
    || normalized === '0.0.0.0'
    || normalized === '::1'
    || normalized.endsWith('.local')
    || normalized.startsWith('10.')
    || normalized.startsWith('192.168.')
    || normalized.startsWith('172.16.')
    || normalized.startsWith('172.17.')
    || normalized.startsWith('172.18.')
    || normalized.startsWith('172.19.')
    || normalized.startsWith('172.2')
    || normalized.startsWith('172.30.')
    || normalized.startsWith('172.31.')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey) return response({ error: 'Function is not configured' }, 500)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return response({ error: 'Authentication required' }, 401)

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  })
  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user || userData.user.app_metadata?.role !== 'admin') {
    return response({ error: 'Admin access required' }, 403)
  }

  let sourceUrl: URL
  let artworkId: string
  try {
    const payload = await request.json()
    sourceUrl = new URL(payload.source_url)
    artworkId = payload.artwork_id
  } catch {
    return response({ error: 'source_url and artwork_id are required' }, 400)
  }

  if (sourceUrl.protocol !== 'https:') return response({ error: 'Only HTTPS image URLs are accepted' }, 400)
  if (isPrivateHost(sourceUrl.hostname)) return response({ error: 'Private network URLs are not accepted' }, 400)
  if (!artworkId || !/^[0-9a-f-]{36}$/i.test(artworkId)) return response({ error: 'Invalid artwork_id' }, 400)

  let imageResponse: Response
  try {
    imageResponse = await fetch(sourceUrl, { redirect: 'error' })
  } catch {
    return response({ error: 'Could not reach the source image without following a redirect' }, 422)
  }
  if (!imageResponse.ok || !imageResponse.body) return response({ error: 'Could not download the source image' }, 422)

  const contentType = imageResponse.headers.get('content-type')?.split(';')[0].toLowerCase() || ''
  const extension = allowedTypes.get(contentType)
  if (!extension) return response({ error: 'Only JPEG, PNG and WebP images are accepted' }, 415)

  const declaredLength = Number(imageResponse.headers.get('content-length') || 0)
  if (declaredLength > MAX_IMAGE_BYTES) return response({ error: 'Image exceeds the 12 MB limit' }, 413)

  const reader = imageResponse.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    totalBytes += value.byteLength
    if (totalBytes > MAX_IMAGE_BYTES) return response({ error: 'Image exceeds the 12 MB limit' }, 413)
    chunks.push(value)
  }

  const image = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    image.set(chunk, offset)
    offset += chunk.byteLength
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const path = `${artworkId}/original.${extension}`
  const { error: uploadError } = await adminClient.storage.from('artworks').upload(path, image, {
    contentType,
    upsert: true,
  })
  if (uploadError) return response({ error: uploadError.message }, 502)

  const { data: publicUrl } = adminClient.storage.from('artworks').getPublicUrl(path)
  const { error: updateError } = await adminClient
    .from('artworks')
    .update({ final_image_url: publicUrl.publicUrl })
    .eq('id', artworkId)

  if (updateError) return response({ error: updateError.message }, 500)
  return response({ path, public_url: publicUrl.publicUrl })
})
