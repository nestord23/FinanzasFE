import React from 'react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
  icon?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  change,
  variant = 'default',
  icon,
}: StatsCardProps) {
  const formatChange = (num: number) => {
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  return (
    <div className={`${styles.statsCard} ${styles[`statsCard--${variant}`]}`}>
      <div className={styles.statsCardHeader}>
        <span className={styles.statsCardTitle}>{title}</span>
        {icon && <div className={styles.statsCardIcon}>{icon}</div>}
      </div>
      <div className={styles.statsCardValue}>{value}</div>
      {change !== undefined && (
        <div
          className={`${styles.statsCardChange} ${
            change >= 0 ? styles.statsCardChangePositive : styles.statsCardChangeNegative
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {change >= 0 ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
          <span>{formatChange(change)}</span>
        </div>
      )}
    </div>
  );
}
