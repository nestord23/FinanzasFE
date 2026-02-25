'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    section: 'Principal',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Mercado',
    items: [
      {
        label: 'Acciones',
        href: '/acciones',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-3 3" />
          </svg>
        ),
      },
      {
        label: 'Órdenes',
        href: '/ordenes',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
          </svg>
        ),
      },
      {
        label: 'Estadísticas',
        href: '/estadisticas',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.21 15.89A10 10 0 118 2.83" />
            <path d="M22 12A10 10 0 0012 2v10z" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logo}>
            <span>Bolsa</span>Sim
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((section) => (
            <div key={section.section} className={styles.sidebarSection}>
              <h3 className={styles.sidebarSectionTitle}>{section.section}</h3>
              <ul className={styles.sidebarList}>
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.sidebarLink} ${
                        pathname === item.href ? styles.sidebarLinkActive : ''
                      }`}
                      onClick={onClose}
                    >
                      <span className={styles.sidebarLinkIcon}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/logout" className={styles.sidebarLink}>
            <span className={styles.sidebarLinkIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
