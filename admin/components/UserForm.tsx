import React, { useState, useEffect } from "react";
import { User } from "../sanity/types";
import { 
  validateUser, 
  UserFormData, 
  UserValidationErrors, 
  hasValidationErrors, 
  getFieldError, 
  isFieldValid 
} from "./userValidation";

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

export function UserForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isEditing = false, 
  loading = false 
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    role: "user"
  });
  const [errors, setErrors] = useState<UserValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const updatedFormData = {
        ...formData,
        username: initialData.username,
        email: initialData.email,
        role: (initialData.role as "user" | "admin") || "user"
      };
      
      setFormData(updatedFormData);
      
      // Mark all fields as touched in edit mode so validation errors show immediately
      if (isEditing) {
        const allFields = ['username', 'email', 'role'];
        setTouched(new Set(allFields));
        
        // Run validation on the updated form data in edit mode
        const initialValidationErrors = validateUser(updatedFormData);
        setErrors(initialValidationErrors);
      }
    }
  }, [initialData, isEditing]);

  const handleFieldChange = (field: keyof UserFormData, value: any) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Mark field as touched
    setTouched(prev => new Set([...prev, field]));
  };

  const handleFieldBlur = (field: keyof UserFormData) => {
    setTouched(prev => new Set(prev).add(field));
    // Validate the entire form data to catch cross-field validations
    const validationErrors = validateUser(formData);
    setErrors(validationErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['username', 'email', 'role'];
    setTouched(new Set(allFields));
    
    // Validate form
    const validationErrors = validateUser(formData);
    setErrors(validationErrors);
    
    if (hasValidationErrors(validationErrors)) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const isFieldInvalid = (field: keyof UserFormData): boolean => {
    return touched.has(field) && !!errors[field];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Username */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Username *
          </label>
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) => handleFieldChange('username', e.target.value)}
            onBlur={() => handleFieldBlur('username')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('username') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter username"
          />
          {getFieldError(errors, 'username') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError(errors, 'username')}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email *
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('email') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter email"
          />
          {getFieldError(errors, 'email') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError(errors, 'email')}</span>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Role *
          </label>
          <select
            value={formData.role || "user"}
            onChange={(e) => handleFieldChange('role', e.target.value)}
            onBlur={() => handleFieldBlur('role')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('role') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {getFieldError(errors, 'role') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError(errors, 'role')}</span>
          )}
        </div>
      </div>

      

      {/* Form Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update User" : "Create User")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
