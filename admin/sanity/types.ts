export interface User {
  _id: string
  username: string
  id: string
  email: string
  role: 'user' | 'admin'
}
