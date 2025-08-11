import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-08-07',
  token: process.env.SANITY_API_TOKEN!, // must have write access
  useCdn: false,
})

// Find user by email
export async function getUserByEmail(email: string) {
  return client.fetch(`*[_type == "user" && email == $email][0]`, { email })
}

// Create a new user document
export async function createUser(user: {
  username?: string
  id?: string
  email: string
}) {
  return client.create({
    _type: 'user',
    username: user.username || '',
    id: user.id || '',
    email: user.email,
    role: 'user',
  })
}

// Update user email by Sanity document ID
export async function updateUserEmail(sanityUserId: string, newEmail: string) {
  return client.patch(sanityUserId).set({ email: newEmail }).commit()
}

// Sync user data to Sanity: create or update email if changed
export async function syncUserToSanity(user: {
  username?: string
  id?: string
  email: string
}) {
  const existing = await getUserByEmail(user.email)

  if (existing) {
    // User with this email already exists, return it
    return existing
  }

  // If no user with this email, try to find by ID and update email if needed
  if (user.id) {
    const queryById = `*[_type == "user" && id == $id][0]`
    const userById = await client.fetch(queryById, { id: user.id })

    if (userById) {
      if (userById.email !== user.email) {
        await updateUserEmail(userById._id, user.email)
      }
      return { ...userById, email: user.email }
    }
  }

  // If no existing user by email or id, create new user
  const newUser = await createUser(user)
  return newUser
}
