import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'success' | 'danger' | 'warning' | 'flat';
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  clickable = false,
  className = '',
  onClick,
}: CardProps) {
  const classNames = [
    styles.card,
    variant !== 'default' && styles[`card--${variant}`],
    clickable && styles['card--clickable'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function CardHeader({ title, subtitle, actions }: CardHeaderProps) {
  return (
    <div className={styles.cardHeader}>
      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.cardActions}>{actions}</div>}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function CardContent({ children, noPadding = false }: CardContentProps) {
  return (
    <div className={`${styles.cardContent} ${noPadding ? styles.cardContentNoPadding : ''}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className={styles.cardFooter}>{children}</div>;
}
