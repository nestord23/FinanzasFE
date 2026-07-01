'use client';

import Card, { CardHeader, CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Accion } from '@/lib/api';
import { useSSEContext } from '@/hooks/SSEContext';
import styles from './Acciones.module.css';

export default function AccionesPage() {
  const { connected, precios } = useSSEContext();

  const acciones = precios;

  const handleComprar = (accion: Accion) => {
    console.log('Comprar:', accion);
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Mercado de Acciones</h1>
        <p className="page__subtitle">Explora las acciones disponibles para operar</p>
        <div className={styles.connectionStatus}>
          <span className={`${styles.indicator} ${connected ? styles.connected : ''}`} />
          {connected || precios.length > 0 ? 'Actualizado' : 'Cargando...'}
        </div>
      </div>

      <Card>
        <CardHeader title="Listado de Acciones" subtitle={`${acciones.length} acciones disponibles`} />
        <CardContent noPadding>
          <div className={styles.accionesTable}>
            <div className={styles.tableHeader}>
              <span>Símbolo</span>
              <span>Nombre</span>
              <span>Precio</span>
              <span>Variación</span>
              <span>Acción</span>
            </div>
            {acciones.map((accion) => (
              <div key={accion.id} className={styles.tableRow}>
                <div className={styles.simboloCell}>
                  <span className={styles.simbolo}>{accion.simbolo}</span>
                </div>
                <div className={styles.nombreCell}>{accion.nombre}</div>
                <div className={styles.precioCell}>${accion.precio_actual.toFixed(2)}</div>
                <div
                  className={`${styles.variacionCell} ${
                    accion.variacion >= 0 ? styles.variacionPositiva : styles.variacionNegativa
                  }`}
                >
                  {accion.variacion >= 0 ? '+' : ''}
                  {accion.variacion}%
                </div>
                <div className={styles.actionCell}>
                  <Button variant="outline" size="sm" onClick={() => handleComprar(accion)}>
                    Comprar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
