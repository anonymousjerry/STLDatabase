import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { createUserApi, deleteUserApi, getAllUser, updateUserApi } from '../lib/userApi'
import { User } from '../sanity/types';

export interface UserPayload {
  username: string;
  email: string;
  role: 'user' | 'admin';
}


export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<User>>({})
  const [filter, setFilter] = useState('')
  const [isFormVisible, setIsFormVisible] = useState(false);

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllUser()
      setUsers(res)
    } catch (err: any) {
      console.error(err)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const startEdit = (u: User) => {
    setEditingId(u.id)
    setForm({ username: u.username, email: u.email, role: u.role })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({})
  }

  const createUser = async () => {
    if (!form.username || !form.email) {
      showAlert('error', 'Username and Email are required!')
      return
    }
    try {
      setLoading(true)
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role ?? 'user'
      }
      await createUserApi(payload);
      await refresh()
      setForm({})
      showAlert('success', 'User created successfully!')
    } catch (err: any) {
      console.error(err)
      showAlert('error', err?.response?.data?.error || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: string) => {
    try {
      setLoading(true)
      const payload = {
        id,
        username: form.username ?? "",
        email: form.email ?? "",
        role: form.role ?? "user",
      }
      await updateUserApi(payload)
      await refresh()
      setEditingId(null)
      setForm({})
      showAlert('success', 'User updated successfully!')
    } catch (err: any) {
      console.error(err)
      showAlert('error', err?.response?.data?.error || 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    console.log("123")
    if (!confirm('Delete this user?')) return
    try {
      setLoading(true)
      await deleteUserApi(id);
      await refresh()
      showAlert('success', 'User deleted successfully!')
    } catch (err: any) {
      console.error(err)
      showAlert('error', err?.response?.data?.error || 'Failed to delete user')
    } finally {
      setLoading(false)
    }
  }


  const filtered = users.filter((u) => {
    if (!filter) return true
    const s = filter.toLowerCase()
    return u.username.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.role.toLowerCase().includes(s)
  })

  const toggleFormVisibility = () => {
  setIsFormVisible((prevState) => !prevState);
};

  return (
    <div className="p-6 bg-white rounded-lg shadow overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col justify-center gap-4 mb-4">
         <div className='flex flex-col'>
          <button
            onClick={toggleFormVisibility}
            className="px-4 py-2 bg-blue-500 text-white rounded-md w-[150px]"
          >
            {isFormVisible ? 'Cancel' : 'Add User'}
          </button>

          {isFormVisible && (
  <form
    className="mt-4 flex flex-col gap-3 p-4 border rounded-lg bg-gray-50"
    onSubmit={(e) => {
      e.preventDefault();
      createUser();
    }}
  >
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex flex-col">
        <label className="text-sm font-medium mb-1">Username <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="Enter username"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.username || ''}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          required
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          placeholder="Enter email"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email || ''}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-sm font-medium mb-1">Role</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.role || 'user'}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'user' | 'admin' }))}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>

    <div className="flex justify-end gap-2 mt-3">
      <button
        type="button"
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        onClick={toggleFormVisibility}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save User'}
      </button>
    </div>
  </form>
)}

        </div>
        <div className="flex items-center gap-2">
          <input
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-300"
            placeholder="Search users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Alerts */}
      {alert && (
        <div className={`mb-4 px-4 py-2 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {alert.message}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Username', 'Email', 'Role', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">
                  {editingId === user.id ? (
                    <input
                      className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                      value={form.username || ''}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="px-4 py-3">{editingId === user.id ? (
                  <input
                    className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                    value={form.email || ''}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                ) : user.email}</td>
                <td className="px-4 py-3">
                  {editingId === user.id ? (
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      value={form.role || 'user'}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'user' | 'admin' }))}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {editingId === user.id ? (
                    <>
                      <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={() => updateUser(user.id)}>Save</button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm" onClick={() => startEdit(user)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900 text-sm" onClick={() => deleteUser(user.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
