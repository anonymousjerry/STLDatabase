import React, { useEffect, useState } from "react";
import { createUserApi, deleteUserApi, getAllUser, updateUserApi } from "../lib/userApi";
import { User } from "../sanity/types";
import { Pencil, Trash2, Check, X } from "lucide-react"; // ✅ icons

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [filter, setFilter] = useState("");
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
      await createUserApi({ username: form.username, email: form.email, role: form.role ?? "user" });
      await refresh();
      setForm({});
      showAlert("success", "User created successfully!");
      setIsFormVisible(false)
    } catch {
      showAlert("error", "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string) => {
    try {
      setLoading(true);
      await updateUserApi({ id, username: form.username ?? "", email: form.email ?? "", role: form.role ?? "user" });
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

  const filtered = users.filter((u) => {
    if (!filter) return true;
    const s = filter.toLowerCase();
    return u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.role.toLowerCase().includes(s);
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow overflow-hidden">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsFormVisible((p) => !p)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isFormVisible ? "Cancel" : "Add User"}
        </button>

        <input
          className="bg-gray-50 text-gray-900 border border-gray-300 rounded px-3 py-2 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Alerts */}
      {alert && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Add User Form */}
      {isFormVisible && (
        <form
          className="mb-4 flex flex-col gap-3 p-4 border rounded-lg bg-gray-50"
          onSubmit={(e) => {
            e.preventDefault();
            createUser();
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Username"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              value={form.username || ""}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              value={form.email || ""}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <select
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              value={form.role || "user"}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "user" | "admin" }))}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Username", "Email", "Role", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-3 py-2">{user.id}</td>
                <td className="px-3 py-2">
                  {editingId === user.id ? (
                    <input
                      className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                      value={form.username || ""}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="px-3 py-2">
                  {editingId === user.id ? (
                    <input
                      className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                      value={form.email || ""}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-3 py-2">
                  {editingId === user.id ? (
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={form.role || "user"}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "user" | "admin" }))}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {editingId === user.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => updateUser(user.id)} className="text-green-600 hover:text-green-800">
                        <Check size={18} />
                      </button>
                      <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(user)} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
