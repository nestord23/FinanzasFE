import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[`button--${variant}`],
    size !== 'md' && styles[`button--${size}`],
    fullWidth && styles['button--full'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <span className={styles.spinner} />
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
