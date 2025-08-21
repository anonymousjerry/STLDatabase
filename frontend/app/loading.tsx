// app/loading.tsx
'use client';

import { Oval } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div className="loading-overlay">
      <Oval height={80} width={80} />
    </div>
  );
}