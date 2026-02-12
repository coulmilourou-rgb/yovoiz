import { Suspense } from 'react';
import ResetPasswordContent from './ResetPasswordContent';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
