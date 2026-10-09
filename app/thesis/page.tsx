'use client';

import React from 'react';
import ThesisLegalDocument from '../../components/modals/ThesisLegalDocument';

export default function ThesisPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <ThesisLegalDocument onBackToWorkout={() => (window.location.href = '/')} />
    </main>
  );
}
