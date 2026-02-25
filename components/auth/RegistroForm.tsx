'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function RegistroForm() {
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp(email, password, nombre);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {success ? (
        <div className="form__success">
          ¡Registro exitoso! Por favor, inicia sesión.
        </div>
      ) : (
        <>
          {error && <div className="form__error">{error}</div>}

      <Input
        type="text"
        label="Nombre completo"
        placeholder="Juan Doe"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        type="email"
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        helperText="Mínimo 8 caracteres"
      />

      <Input
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <div className="form__actions">
        <Button type="submit" fullWidth isLoading={loading}>
          Crear cuenta
        </Button>
      </div>
        </>
      )}
    </form>
  );
}
