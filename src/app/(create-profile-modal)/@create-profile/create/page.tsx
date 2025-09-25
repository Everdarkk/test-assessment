'use client';

import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';
import ProfileForm from '@/components/ProfileForm';

export default function Modal() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
    >
      <div>
        <button onClick={onDismiss}>
          &times;
        </button>
        <ProfileForm />
      </div>
    </dialog>
  );
}