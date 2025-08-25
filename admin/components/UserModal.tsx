import { X } from "lucide-react";
import React from "react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: Array<{ id: string; username: string; email: string }>;
}

export function UserModal({ isOpen, onClose, title, users }: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-3">
          {users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No users found
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col bg-gray-50 dark:bg-gray-700 rounded-lg p-3 shadow-sm"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.username}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}