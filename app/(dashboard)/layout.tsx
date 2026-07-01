'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import AuthGuard from '@/components/auth/AuthGuard';
import { SSEProvider } from '@/hooks/SSEContext';
import styles from './layout.module.css';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/acciones': 'Mercado de Acciones',
  '/ordenes': 'Historial de Órdenes',
  '/estadisticas': 'Estadísticas',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTitle = pageTitles[pathname] || 'Dashboard';

  return (
    <AuthGuard>
      <SSEProvider>
        <div className={styles.layout}>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className={styles.mainWrapper}>
            <Header title={currentTitle} onMenuClick={() => setSidebarOpen(true)} />
            <main className={styles.mainContent}>{children}</main>
          </div>
        </div>
      </SSEProvider>
    </AuthGuard>
  );
}
