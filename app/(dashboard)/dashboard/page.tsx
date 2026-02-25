'use client';

import { useState, useEffect } from 'react';
import Card, { CardHeader, CardContent } from '@/components/common/Card';
import StatsCard from '@/components/dashboard/StatsCard';
import Link from 'next/link';
import { getMiPerfil, getMisPosiciones, getMisOrdenes, Perfil, Posicion, Orden } from '@/lib/api';

export default function DashboardPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfilData, posicionesData, ordenesData] = await Promise.all([
          getMiPerfil(),
          getMisPosiciones(),
          getMisOrdenes(),
        ]);
        setPerfil(perfilData);
        setPosiciones(posicionesData);
        setOrdenes(ordenesData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const valorTotal = posiciones.reduce((acc, pos) => {
    const precio = pos.acciones?.precio_actual || 0;
    return acc + (precio * pos.cantidad);
  }, 0);

  const ganancia = perfil ? valorTotal - (posiciones.reduce((acc, pos) => acc + (pos.precio_promedio * pos.cantidad), 0)) : 0;
  const gananciaPorcentaje = posiciones.length > 0 ? (ganancia / valorTotal) * 100 : 0;

  if (loading) {
    return (
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Dashboard</h1>
        </div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Dashboard</h1>
        </div>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Resumen de tu Portfolio</h1>
        <p className="page__subtitle">Aquí está el estado actual de tus inversiones</p>
      </div>

      <div className="dashboard-stats">
        <StatsCard
          title="Saldo Disponible"
          value={`$${(perfil?.saldo || 0).toLocaleString()}`}
          variant="primary"
        />
        <StatsCard
          title="Acciones"
          value={posiciones.length.toString()}
          variant="default"
        />
        <StatsCard
          title="Valor Total"
          value={`$${valorTotal.toLocaleString()}`}
          variant="success"
        />
        <StatsCard
          title="Ganancia/Pérdida"
          value={`$${ganancia.toLocaleString()}`}
          change={gananciaPorcentaje}
          variant={ganancia >= 0 ? 'success' : 'danger'}
        />
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader
            title="Mis Acciones"
            subtitle="Tenencias actuales"
            actions={
              <Link href="/acciones" className="button button--sm button--outline">
                Ver todas
              </Link>
            }
          />
          <CardContent>
            {posiciones.length === 0 ? (
              <p>No tienes acciones aún</p>
            ) : (
              <div className="acciones-grid">
                {posiciones.map((pos) => (
                  <div key={pos.id} className="accion-card">
                    <div className="accion-card__header">
                      <div>
                        <div className="accion-card__simbolo">{pos.acciones?.simbolo}</div>
                        <div className="accion-card__nombre">{pos.acciones?.nombre}</div>
                      </div>
                    </div>
                    <div className="accion-card__precio">${(pos.acciones?.precio_actual || 0).toFixed(2)}</div>
                    <span className="accion-card__cantidad">Cant: {pos.cantidad}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Últimas Órdenes"
            actions={
              <Link href="/ordenes" className="button button--sm button--ghost">
                Ver todas
              </Link>
            }
          />
          <CardContent>
            {ordenes.length === 0 ? (
              <p>No tienes órdenes aún</p>
            ) : (
              <div className="orden-list">
                {ordenes.slice(0, 5).map((orden) => (
                  <div key={orden.id} className="orden-item">
                    <div className="orden-item__info">
                      <span className={`orden-item__tipo orden-item__tipo--${orden.tipo}`}>
                        {orden.tipo}
                      </span>
                      <span className="orden-item__detalle">
                        {orden.cantidad} {orden.acciones?.simbolo} @ ${orden.precio_unitario}
                      </span>
                      <span className="orden-item__fecha">
                        {new Date(orden.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`orden-item__status orden-item__status--${orden.estado}`}>
                      {orden.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
