import React, { useState } from "react";
import { User } from "../sanity/types";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { validateUser, UserFormData } from "./userValidation";

interface UserTableRowProps {
  user: User;
  onUpdate: (id: string, data: Partial<User>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function UserTableRow({ 
  user, 
  onUpdate, 
  onDelete, 
  loading = false 
}: UserTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({
    username: user.username,
    email: user.email,
    role: user.role,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof User, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (field: keyof User, value: any): string | null => {
    // For all fields, validate with current edit data
    const validationData = {
      ...editData,
      [field]: value
    } as UserFormData;
    const validation = validateUser(validationData);
    return validation[field as keyof typeof validation] || null;
  };

  const handleFieldBlur = (field: keyof User) => {
    const error = validateField(field, editData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      // Clear error if validation passes
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({});
    setErrors({});
  };

  const saveEdit = async () => {
    // Validate all fields together
    const validationData = {
      username: editData.username,
      email: editData.email,
      role: editData.role,
    } as UserFormData;
    
    const validation = validateUser(validationData);
    const validationErrors: Record<string, string> = {};
    
    // Only include fields that are being edited
    const fieldsToValidate: (keyof User)[] = ['username', 'email', 'role'];
    fieldsToValidate.forEach(field => {
      if (validation[field as keyof typeof validation]) {
        validationErrors[field] = validation[field as keyof typeof validation]!;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if there are any changes
    const hasChanges = Object.keys(editData).some(key => {
      const field = key as keyof User;
      return editData[field] !== user[field];
    });

    if (!hasChanges) {
      cancelEdit();
      return;
    }

    try {
      await onUpdate(user.id, editData);
      cancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field];
  };

  const isFieldInvalid = (field: string): boolean => {
    return !!errors[field];
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      {/* Username - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="text"
              value={editData.username || ""}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              onBlur={() => handleFieldBlur('username')}
              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                isFieldInvalid('username') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {getFieldError('username') && (
              <span className="text-red-500 text-xs mt-1">{getFieldError('username')}</span>
            )}
          </div>
        ) : (
          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
        )}
      </td>

      {/* Email - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="email"
              value={editData.email || ""}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                isFieldInvalid('email') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {getFieldError('email') && (
              <span className="text-red-500 text-xs mt-1">{getFieldError('email')}</span>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
        )}
      </td>

      {/* Saved Models - Read-only */}
      <td className="px-6 py-4 whitespace-nowrap">
        {Array.isArray(user.favourites) && user.favourites.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {user.favourites.map((fav) => (
              <a
                key={fav.id}
                href={fav.model.websiteUrl || '#'}
                target="_blank"
                className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {fav.model.title}
              </a>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-sm">No saved models</span>
        )}
      </td>

      {/* Role - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex flex-col">
            <select
              value={editData.role || "user"}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              onBlur={() => handleFieldBlur('role')}
              className={`px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                isFieldInvalid('role') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {getFieldError('role') && (
              <span className="text-red-500 text-xs mt-1">{getFieldError('role')}</span>
            )}
          </div>
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

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
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
              onClick={startEdit}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
