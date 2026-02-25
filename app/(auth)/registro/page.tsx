import RegistroForm from '@/components/auth/RegistroForm';

export const metadata = {
  title: 'Registrarse - BolsaSim',
};

export default function RegistroPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo">BolsaSim</div>
          <h1 className="auth-card__title">Crear cuenta</h1>
          <p className="auth-card__subtitle">Únete a la simulación de bolsa</p>
        </div>

        <RegistroForm />

        <div className="auth-card__footer">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
