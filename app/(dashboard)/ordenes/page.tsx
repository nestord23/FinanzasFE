'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '@/components/common/Card';
import { getMisOrdenes, Orden } from '@/lib/api';
import styles from './Ordenes.module.css';

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const data = await getMisOrdenes();
        setOrdenes(data);
      } catch (err) {
        setError('Error al cargar las órdenes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  const ordenesCompletadas = ordenes.filter(o => o.estado === 'completada');
  const ordenesPendientes = ordenes.filter(o => o.estado === 'pendiente');
  const ordenesCanceladas = ordenes.filter(o => o.estado === 'cancelada');

  if (loading) {
    return (
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Historial de Órdenes</h1>
        </div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Historial de Órdenes</h1>
        </div>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Historial de Órdenes</h1>
        <p className="page__subtitle">Todas tus transacciones y órdenes</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{ordenesCompletadas.length}</span>
          <span className={styles.statLabel}>Completadas</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{ordenesPendientes.length}</span>
          <span className={styles.statLabel}>Pendientes</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{ordenesCanceladas.length}</span>
          <span className={styles.statLabel}>Canceladas</span>
        </div>
      </div>

      <Card>
        <CardHeader title="Todas las Órdenes" subtitle={`${ordenes.length} órdenes`} />
        <CardContent noPadding>
          {ordenes.length === 0 ? (
            <p style={{ padding: '1rem' }}>No tienes órdenes aún</p>
          ) : (
            <div className={styles.ordenesTable}>
              <div className={styles.tableHeader}>
                <span>Tipo</span>
                <span>Acción</span>
                <span>Cantidad</span>
                <span>Precio</span>
                <span>Total</span>
                <span>Fecha</span>
                <span>Estado</span>
              </div>
              {ordenes.map((orden) => (
                <div key={orden.id} className={styles.tableRow}>
                  <div>
                    <span className={`orden-item__tipo orden-item__tipo--${orden.tipo}`}>
                      {orden.tipo}
                    </span>
                  </div>
                  <div className={styles.simboloCell}>
                    <span className={styles.simbolo}>{orden.acciones?.simbolo}</span>
                    <span className={styles.nombre}>{orden.acciones?.nombre}</span>
                  </div>
                  <div className={styles.cantidadCell}>{orden.cantidad}</div>
                  <div className={styles.precioCell}>${orden.precio_unitario.toFixed(2)}</div>
                  <div className={styles.totalCell}>${orden.precio_total.toFixed(2)}</div>
                  <div className={styles.fechaCell}>
                    {new Date(orden.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className={`orden-item__status orden-item__status--${orden.estado}`}>
                      {orden.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
