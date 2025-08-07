// lib/sanity/user.ts
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-08-07',
  token: process.env.SANITY_API_TOKEN!, // must have write access
  useCdn: false,
})

export async function syncUserToSanity(user: {
  name?: string
  email: string
}) {
  const query = `*[_type == "user" && email == $email][0]`
  const existing = await client.fetch(query, { email: user.email })

  if (existing) return existing

  const newUser = await client.create({
    _type: 'user',
    name: user.name || '',
    email: user.email,
    role: 'user'
  })

  return newUser
}
