import Card, { CardHeader, CardContent } from '@/components/common/Card';
import StatsCard from '@/components/dashboard/StatsCard';
import styles from './Estadisticas.module.css';

export const metadata = {
  title: 'Estadísticas - BolsaSim',
};

export default function EstadisticasPage() {
  const stats = {
    totalInvertido: 10000,
    valorActual: 12500,
    gananciaTotal: 2500,
    rendimiento: 25.0,
    operacionesGanadoras: 8,
    operacionesPerdedoras: 2,
    mejorOperacion: 450,
    peorOperacion: -120,
  };

  const historial = [
    { mes: 'Ene', inversion: 10000, valor: 10500 },
    { mes: 'Feb', inversion: 10500, valor: 11200 },
    { mes: 'Mar', inversion: 11200, valor: 10800 },
    { mes: 'Abr', inversion: 10800, valor: 11800 },
    { mes: 'May', inversion: 11800, valor: 12500 },
  ];

  const maxValor = Math.max(...historial.map(h => h.valor));

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Estadísticas</h1>
        <p className="page__subtitle">Análisis detallado de tu rendimiento</p>
      </div>

      <div className="dashboard-stats">
        <StatsCard
          title="Total Invertido"
          value={`$${stats.totalInvertido.toLocaleString()}`}
          variant="default"
        />
        <StatsCard
          title="Valor Actual"
          value={`$${stats.valorActual.toLocaleString()}`}
          variant="primary"
        />
        <StatsCard
          title="Ganancia Total"
          value={`$${stats.gananciaTotal.toLocaleString()}`}
          change={stats.rendimiento}
          variant="success"
        />
        <StatsCard
          title="Operaciones Ganadoras"
          value={`${stats.operacionesGanadoras}/${stats.operacionesGanadoras + stats.operacionesPerdedoras}`}
          variant="success"
        />
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader title="Evolución del Portfolio" subtitle="Últimos 5 meses" />
          <CardContent>
            <div className={styles.chart}>
              {historial.map((item, index) => {
                const height = (item.valor / maxValor) * 100;
                return (
                  <div key={item.mes} className={styles.chartBar}>
                    <div className={styles.barContainer}>
                      <div
                        className={styles.bar}
                        style={{ height: `${height}%` }}
                      >
                        <span className={styles.barValue}>${item.valor.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className={styles.barLabel}>{item.mes}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className={styles.statsColumn}>
          <Card>
            <CardHeader title="Mejores/Peasores Operaciones" />
            <CardContent>
              <div className={styles.operacion}>
                <span className={styles.operacionLabel}>Mejor operación</span>
                <span className={styles.operacionValuePositiva}>+${stats.mejorOperacion}</span>
              </div>
              <div className={styles.operacion}>
                <span className={styles.operacionLabel}>Peor operación</span>
                <span className={styles.operacionValueNegativa}>${stats.peorOperacion}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Rendimiento por Operación" />
            <CardContent>
              <div className={styles.rendimiento}>
                <div className={styles.rendimientoItem}>
                  <div className={styles.rendimientoBar}>
                    <div
                      className={styles.rendimientoFillPositivo}
                      style={{ width: `${(stats.operacionesGanadoras / 10) * 100}%` }}
                    />
                  </div>
                  <span className={styles.rendimientoLabel}>
                    Ganadoras: {stats.operacionesGanadoras}
                  </span>
                </div>
                <div className={styles.rendimientoItem}>
                  <div className={styles.rendimientoBar}>
                    <div
                      className={styles.rendimientoFillNegativo}
                      style={{ width: `${(stats.operacionesPerdedoras / 10) * 100}%` }}
                    />
                  </div>
                  <span className={styles.rendimientoLabel}>
                    Perdedoras: {stats.operacionesPerdedoras}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
