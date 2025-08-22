import React, { useEffect, useState } from "react";
import { createUserApi, deleteUserApi, getAllUser, updateUserApi } from "../lib/userApi";
import { User } from "../sanity/types";
import { Pencil, Trash2, Check, X, Plus, Search } from "lucide-react";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getAllUser();
      setUsers(res);
    } catch {
      setAlert({ type: "error", message: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setForm({ username: u.username, email: u.email, role: u.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const createUser = async () => {
    if (!form.username || !form.email) {
      showAlert("error", "Username and Email are required!");
      return;
    }
    try {
      setLoading(true);
      await createUserApi({ username: form.username, email: form.email, role: form.role as "user" | "admin" });
      await refresh();
      setForm({});
      showAlert("success", "User created successfully!");
      setIsFormVisible(false);
    } catch {
      showAlert("error", "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string) => {
    try {
      setLoading(true);
      await updateUserApi({ id, username: form.username ?? "", email: form.email ?? "", role: form.role as "user" | "admin" });
      await refresh();
      cancelEdit();
      showAlert("success", "User updated successfully!");
    } catch {
      showAlert("error", "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      setLoading(true);
      await deleteUserApi(id);
      await refresh();
      showAlert("success", "User deleted successfully!");
    } catch {
      showAlert("error", "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return u.username.toLowerCase().includes(search) || 
           u.email.toLowerCase().includes(search) || 
           u.role.toLowerCase().includes(search);
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`p-4 mx-6 mt-4 rounded-lg ${
          alert.type === "success" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {alert.message}
        </div>
      )}

      {/* Search and Actions */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by username, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={refresh}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Create User Form */}
      {isFormVisible && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Username"
              value={form.username || ""}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            />
            <select
              value={form.role || "user"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={createUser}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
            <button
              onClick={() => {
                setIsFormVisible(false);
                setForm({});
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading users...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={form.username || ""}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user.id ? (
                      <input
                        type="email"
                        value={form.email || ""}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user.id ? (
                      <select
                        value={form.role || "user"}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin" 
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" 
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUser(user.id)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
