import React from "react";
import { X } from "lucide-react";
import { AdPosition } from "../sanity/types";
import { AdPositionForm } from "./AdPositionForm";
import { AdPositionFormData } from "./adPositionValidation";

interface AdPositionEditModalProps {
  adPosition: AdPosition | null;
  onClose: () => void;
  onSubmit: (data: AdPositionFormData) => Promise<void>;
  loading?: boolean;
}

export function AdPositionEditModal({ 
  adPosition, 
  onClose, 
  onSubmit, 
  loading = false 
}: AdPositionEditModalProps) {
  if (!adPosition) return null;

  return (
    <div className="fixed top-24 inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Ad Position
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <AdPositionForm
            initialData={adPosition}
            onSubmit={onSubmit}
            onCancel={onClose}
            isEditing={true}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
