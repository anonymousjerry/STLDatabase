// components/LoadingSpinner.tsx
"use client";

import { useLoading } from "@/context/LoadingContext";

export default function LoadingSpinner() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
    </div>
  );
}
