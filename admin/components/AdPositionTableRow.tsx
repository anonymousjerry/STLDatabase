import React, { useState } from "react";
import { AdPosition } from "../sanity/types";
import { Pencil, Trash2, Check, X, Eye, EyeOff } from "lucide-react";
import { validateAdPosition, AdPositionFormData } from "./adPositionValidation";

interface AdPositionTableRowProps {
  ad: AdPosition;
  onUpdate: (id: string, data: Partial<AdPosition>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, enabled: boolean) => Promise<void>;
  loading?: boolean;
}

export function AdPositionTableRow({ 
  ad, 
  onUpdate, 
  onDelete, 
  onToggle, 
  loading = false 
}: AdPositionTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<AdPosition>>({
    title: ad.title,
    adSlot: ad.adSlot,
    clientName: ad.clientName,
    clientEmail: ad.clientEmail,
    startDate: ad.startDate,
    endDate: ad.endDate,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof AdPosition, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (field: keyof AdPosition, value: any): string | null => {
    // For date fields, we need to validate with both dates to check range validation
    if (field === 'startDate' || field === 'endDate') {
      const validationData = {
        ...editData,
        [field]: value
      } as AdPositionFormData;
      const validation = validateAdPosition(validationData);
      return validation[field as keyof typeof validation] || null;
    }
    
    // For other fields, validate individually
    const validation = validateAdPosition({ [field]: value } as AdPositionFormData);
    return validation[field as keyof typeof validation] || null;
  };

  const handleFieldBlur = (field: keyof AdPosition) => {
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
      title: ad.title,
      adSlot: ad.adSlot,
      clientName: ad.clientName,
      clientEmail: ad.clientEmail,
      startDate: ad.startDate,
      endDate: ad.endDate,
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({});
    setErrors({});
  };

  const saveEdit = async () => {
    // Validate all fields together to catch cross-field validations
    const validationData = {
      title: editData.title,
      adSlot: editData.adSlot,
      clientName: editData.clientName,
      clientEmail: editData.clientEmail,
      startDate: editData.startDate,
      endDate: editData.endDate,
    } as AdPositionFormData;
    
    const validation = validateAdPosition(validationData);
    const validationErrors: Record<string, string> = {};
    
    // Only include fields that are being edited
    const fieldsToValidate: (keyof AdPosition)[] = ['title', 'adSlot', 'clientName', 'clientEmail', 'startDate', 'endDate'];
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
      const field = key as keyof AdPosition;
      return editData[field] !== ad[field];
    });

    if (!hasChanges) {
      cancelEdit();
      return;
    }

    try {
      await onUpdate(ad.id, editData);
      cancelEdit();
    } catch (error) {
      console.error('Error updating ad position:', error);
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
      {/* Title - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="text"
              value={editData.title || ""}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              onBlur={() => handleFieldBlur('title')}
              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                isFieldInvalid('title') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {getFieldError('title') && (
              <span className="text-red-500 text-xs mt-1">{getFieldError('title')}</span>
            )}
          </div>
        ) : (
          <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.title}</div>
        )}
      </td>

      {/* Page - Read-only */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          ad.page === 'homepage' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
            : ad.page === 'detail'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        }`}>
          {ad.page}
        </span>
      </td>

      {/* Position - Read-only */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{ad.position}</div>
      </td>

      {/* Type - Read-only */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          ad.adType === 'banner' 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
            : ad.adType === 'sidebar'
            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
            : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
        }`}>
          {ad.adType}
        </span>
      </td>

      {/* Size - Read-only */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{ad.size}</div>
      </td>

      {/* Priority - Read-only */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{ad.priority}</div>
      </td>

      {/* Ad Slot - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="text"
              value={editData.adSlot || ""}
              onChange={(e) => handleFieldChange('adSlot', e.target.value)}
              onBlur={() => handleFieldBlur('adSlot')}
              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                isFieldInvalid('adSlot') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="ca-pub-123456789"
            />
            {getFieldError('adSlot') && (
              <span className="text-red-500 text-xs mt-1">{getFieldError('adSlot')}</span>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-900 dark:text-white">{ad.adSlot || "-"}</div>
        )}
      </td>

      {/* Client - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex flex-col">
              <input
                type="text"
                value={editData.clientName || ""}
                onChange={(e) => handleFieldChange('clientName', e.target.value)}
                onBlur={() => handleFieldBlur('clientName')}
                className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                  isFieldInvalid('clientName') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Client name"
              />
              {getFieldError('clientName') && (
                <span className="text-red-500 text-xs mt-1">{getFieldError('clientName')}</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="email"
                value={editData.clientEmail || ""}
                onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
                onBlur={() => handleFieldBlur('clientEmail')}
                className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                  isFieldInvalid('clientEmail') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="client@example.com"
              />
              {getFieldError('clientEmail') && (
                <span className="text-red-500 text-xs mt-1">{getFieldError('clientEmail')}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-900 dark:text-white">
            {ad.clientName && <div className="font-medium">{ad.clientName}</div>}
            {ad.clientEmail && <div className="text-gray-500 dark:text-gray-400">{ad.clientEmail}</div>}
          </div>
        )}
      </td>

      {/* Start Date - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="date"
              value={editData.startDate ? editData.startDate.split('T')[0] : ""}
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
              onBlur={() => handleFieldBlur('startDate')}
              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                isFieldInvalid('startDate') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {getFieldError('startDate') && (
              <span className="text-red-500 text-xs mt-1">{getFieldError('startDate')}</span>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-900 dark:text-white">{ad.startDate || "-"}</div>
        )}
      </td>

      {/* End Date - Editable */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="date"
              value={editData.endDate ? editData.endDate.split('T')[0] : ""}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
              onBlur={() => handleFieldBlur('endDate')}
              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
                isFieldInvalid('endDate') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {getFieldError('endDate') && (
              <span className="text-red-500 text-xs mt-1">{getFieldError('endDate')}</span>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-900 dark:text-white">{ad.endDate || "-"}</div>
        )}
      </td>

      {/* Status - Read-only */}
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggle(ad.id, !ad.enabled)}
          disabled={loading}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            ad.enabled 
              ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {ad.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
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
              onClick={() => onDelete(ad.id)}
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
