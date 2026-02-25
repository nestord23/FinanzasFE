'use client';

import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Abrir menú"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>{title}</h1>
      </div>

      <div className={styles.headerRight}>
        <button
          className={styles.notificationButton}
          aria-label="Notificaciones"
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className={styles.notificationBadge}>3</span>
        </button>

        <div className={styles.user}>
          <div className={styles.userAvatar}>JD</div>
          <span className={styles.userName}>Juan Doe</span>
        </div>
      </div>
    </header>
  );
}
