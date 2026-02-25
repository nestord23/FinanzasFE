import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Iniciar sesión - BolsaSim',
};

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo">BolsaSim</div>
          <h1 className="auth-card__title">Bienvenido de nuevo</h1>
          <p className="auth-card__subtitle">Inicia sesión para continuar</p>
        </div>

        <LoginForm />

        <div className="auth-card__footer">
          ¿No tienes una cuenta? <a href="/registro">Regístrate</a>
        </div>
      </div>
    </div>
  );
}
