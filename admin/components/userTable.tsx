import React, { useEffect, useState } from 'react'
import { useClient } from 'sanity'

export function UserTable() {
  const client = useClient()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ username: '', email: '', role: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  // Fetch users
  const fetchUsers = () => {
    setLoading(true)
    client
      .fetch(`*[_type == "user"]{_id, username, email, role}`)
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Create user
  const createUser = () => {
    if (!formData.username || !formData.email || !formData.role) {
      alert('All fields required')
      return
    }
    client
      .create({
        _type: 'user',
        username: formData.username,
        email: formData.email,
        role: formData.role,
      })
      .then(() => {
        setFormData({ username: '', email: '', role: '' })
        fetchUsers()
      })
  }

  // Update user
  const updateUser = () => {
    if (!editingId) return
    client
      .patch(editingId)
      .set({
        username: formData.username,
        email: formData.email,
        role: formData.role,
      })
      .commit()
      .then(() => {
        setEditingId(null)
        setFormData({ username: '', email: '', role: '' })
        fetchUsers()
      })
  }

  // Delete user
  const deleteUser = (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    client
      .delete(id)
      .then(() => {
        fetchUsers()
      })
  }

  if (loading) return <div>Loading users...</div>

  return (
    <div>
      <h2>Users</h2>

      {/* User Form */}
      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        {editingId ? (
          <button onClick={updateUser}>Update User</button>
        ) : (
          <button onClick={createUser}>Add User</button>
        )}
      </div>

      {/* User Table */}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {user.username}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {user.email}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {user.role}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button
                  onClick={() => {
                    setEditingId(user._id)
                    setFormData({
                      username: user.username,
                      email: user.email,
                      role: user.role,
                    })
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
