import React, { useState, useEffect } from "react";
import { AdPosition } from "../sanity/types";
import { 
  validateAdPosition, 
  AdPositionFormData, 
  AdPositionValidationErrors,
  hasValidationErrors 
} from "./adPositionValidation";

interface AdPositionFormProps {
  initialData?: Partial<AdPosition>;
  onSubmit: (data: AdPositionFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

export function AdPositionForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  loading = false 
}: AdPositionFormProps) {
  const [formData, setFormData] = useState<AdPositionFormData>({
    title: "",
    page: "homepage",
    position: "",
    adType: "banner",
    size: "728x90",
    priority: 1,
    adSlot: "",
    clientName: "",
    clientEmail: "",
    startDate: "",
    endDate: "",
    enabled: true,
    ...initialData
  });

  const [errors, setErrors] = useState<AdPositionValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const updatedFormData = {
        ...formData,
        ...initialData
      };
      
      setFormData(updatedFormData);
      
      // Mark all fields as touched in edit mode so validation errors show immediately
      if (isEditing) {
        const allFields = ['title', 'page', 'position', 'adType', 'size', 'priority', 'adSlot', 'clientName', 'clientEmail', 'startDate', 'endDate', 'enabled'];
        setTouched(new Set(allFields));
        
        // Run validation on the updated form data in edit mode
        const initialValidationErrors = validateAdPosition(updatedFormData);
        setErrors(initialValidationErrors);
      }
    }
  }, [initialData, isEditing]);



  const handleFieldBlur = (field: keyof AdPositionFormData) => {
    setTouched(prev => new Set(prev).add(field));
    // Validate the entire form data to catch cross-field validations (like date ranges)
    const validationErrors = validateAdPosition(formData);
    setErrors(validationErrors);
  };

  // Handle field changes
  const handleFieldChange = (field: keyof AdPositionFormData, value: any) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Mark field as touched
    setTouched(prev => new Set([...prev, field]));
    
    // Auto-populate related fields based on position selection
    if (field === 'position') {
      let newPage: "homepage" | "detail" | "explore" = "homepage";
      let newAdType: "banner" | "sidebar" | "sponsored-model" = "banner";
      let newSize: "728x90" | "300x250" | "300x600" | "native" = "728x90";
      
      if (value.startsWith("homepage")) {
        newPage = "homepage";
      } else if (value.startsWith("detail")) {
        newPage = "detail";
      } else if (value.startsWith("explore")) {
        newPage = "explore";
      }
      
      if (value.includes("banner")) {
        newAdType = "banner";
        newSize = "728x90";
      } else if (value.includes("sidebar")) {
        newAdType = "sidebar";
        newSize = "300x250";
      } else if (value.includes("sponsored")) {
        newAdType = "sponsored-model";
        newSize = "native";
      }
      
      const positionUpdatedData = { 
        ...updatedFormData, 
        position: value,
        page: newPage,
        adType: newAdType,
        size: newSize
      };
      
      setFormData(positionUpdatedData);
      
      // Clear errors for auto-populated fields
      setErrors(prev => ({
        ...prev,
        page: undefined,
        adType: undefined,
        size: undefined
      }));
      
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAdPosition(formData);
    setErrors(validationErrors);
    
    if (hasValidationErrors(validationErrors)) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Only show errors for fields that have been touched or when form is submitted
  const shouldShowError = (field: keyof AdPositionValidationErrors): boolean => {
    return touched.has(field) || Object.keys(errors).length > 0;
  };

  const getFieldError = (field: keyof AdPositionValidationErrors): string | undefined => {
    return shouldShowError(field) ? errors[field] : undefined;
  };

  const isFieldInvalid = (field: keyof AdPositionValidationErrors): boolean => {
    return shouldShowError(field) && !!errors[field];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            onBlur={() => handleFieldBlur('title')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('title') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter ad position title"
          />
          {getFieldError('title') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('title')}</span>
          )}
        </div>

        {/* Position */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Position *
          </label>
          <select
            value={formData.position || ""}
            onChange={(e) => handleFieldChange('position', e.target.value)}
            onBlur={() => handleFieldBlur('position')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('position') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select Position</option>
            <optgroup label="Homepage Positions">
              <option value="homepage-header-banner">Header Banner (728x90)</option>
              <option value="homepage-mid-content-banner">Mid-Content Banner (728x90)</option>
              <option value="homepage-sidebar-right">Right Sidebar (300x250)</option>
              <option value="homepage-sponsored-models">Sponsored Models (Native)</option>
            </optgroup>
            <optgroup label="Detail Page Positions">
              <option value="detail-header-banner">Detail Header Banner (728x90)</option>
              <option value="detail-mid-content-banner">Detail Mid-Content Banner (728x90)</option>
              <option value="detail-sponsored-similar">Detail Sponsored Similar Models (Native)</option>
            </optgroup>
            <optgroup label="Explore Page Positions">
              <option value="explore-header-banner">Explore Header Banner (728x90)</option>
              <option value="explore-mid-content-banner">Explore Mid-Content Banner (728x90)</option>
              <option value="explore-sidebar-right">Explore Right Sidebar (300x250)</option>
              <option value="explore-sponsored-listings">Explore Sponsored Listings (Native)</option>
            </optgroup>
          </select>
          {getFieldError('position') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('position')}</span>
          )}
        </div>

        {/* Priority */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority *
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.priority || 1}
            onChange={(e) => handleFieldChange('priority', parseInt(e.target.value) || 1)}
            onBlur={() => handleFieldBlur('priority')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('priority') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="1-10"
          />
          {getFieldError('priority') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('priority')}</span>
          )}
        </div>

        {/* Ad Slot */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Ad Slot ID
          </label>
          <input
            type="text"
            value={formData.adSlot || ""}
            onChange={(e) => handleFieldChange('adSlot', e.target.value)}
            onBlur={() => handleFieldBlur('adSlot')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('adSlot') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="ca-pub-123456789"
          />
          {getFieldError('adSlot') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('adSlot')}</span>
          )}
        </div>

        {/* Client Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Client Name
          </label>
          <input
            type="text"
            value={formData.clientName || ""}
            onChange={(e) => handleFieldChange('clientName', e.target.value)}
            onBlur={() => handleFieldBlur('clientName')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('clientName') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter client name"
          />
          {getFieldError('clientName') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('clientName')}</span>
          )}
        </div>

        {/* Client Email */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Client Email
          </label>
          <input
            type="email"
            value={formData.clientEmail || ""}
            onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
            onBlur={() => handleFieldBlur('clientEmail')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('clientEmail') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="client@example.com"
          />
          {getFieldError('clientEmail') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('clientEmail')}</span>
          )}
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate ? formData.startDate.split('T')[0] : ""}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            onBlur={() => handleFieldBlur('startDate')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('startDate') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {getFieldError('startDate') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('startDate')}</span>
          )}
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate ? formData.endDate.split('T')[0] : ""}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            onBlur={() => handleFieldBlur('endDate')}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white ${
              isFieldInvalid('endDate') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {getFieldError('endDate') && (
            <span className="text-red-500 text-xs mt-1">{getFieldError('endDate')}</span>
          )}
        </div>

        {/* Enabled */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enabled ?? true}
            onChange={(e) => handleFieldChange('enabled', e.target.checked)}
            className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">Enabled</label>
        </div>
      </div>

             {/* Auto-populated fields (read-only) */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
         <div className="flex flex-col">
           <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
             Page (Auto-populated)
           </label>
           <input
             type="text"
             value={formData.page || ""}
             readOnly
             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
           />
         </div>
         <div className="flex flex-col">
           <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
             Ad Type (Auto-populated)
           </label>
           <input
             type="text"
             value={formData.adType || ""}
             readOnly
             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
           />
         </div>
         <div className="flex flex-col">
           <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
             Size (Auto-populated)
           </label>
           <input
             type="text"
             value={formData.size || ""}
             readOnly
             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
           />
         </div>
       </div>

       {/* Form Actions */}
        <div className="flex gap-3 pt-4">
                   <button
           type="submit"
           disabled={loading}
           className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
         >
            {loading ? "Saving..." : isEditing ? "Update Ad Position" : "Create Ad Position"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
        
        
    </form>
  );
}
