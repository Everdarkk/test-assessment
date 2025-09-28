'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useEffect } from 'react';
import styles from '@/styles/modal.module.css'; // Припустимо, ви створили цей файл стилів

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Функція для закриття модального вікна
  const close = useCallback(() => {
    // Повертаємося до попереднього URL, що закриває паралельний маршрут
    router.back(); 
  }, [router]);

  // Обробник натискання клавіші Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
    }
  }, [close]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Обробник кліку по оверлею (за межами модалки)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      close();
    }
  };

  return (
    // Оверлей, що займає весь екран
    <div className={styles.overlay} onClick={handleOverlayClick}>
      {/* Контейнер модального вікна */}
      <div ref={modalRef} className={styles.modalContent}>
        <button onClick={close} className={styles.closeButton}>&times;</button>
        {children}
      </div>
    </div>
  );
}