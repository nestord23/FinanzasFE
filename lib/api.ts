const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders(): HeadersInit {
  const session = typeof window !== 'undefined' ? localStorage.getItem('session') : null;
  return session ? { Authorization: `Bearer ${session}` } : {};
}

export interface Accion {
  id: string;
  simbolo: string;
  nombre: string;
  precio_actual: number;
  variacion: number;
  created_at?: string;
  updated_at?: string;
}

export interface Orden {
  id: string;
  user_id: string;
  accion_id: string;
  tipo: 'compra' | 'venta';
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
  estado: string;
  created_at: string;
  acciones?: {
    simbolo: string;
    nombre: string;
  };
}

export interface Posicion {
  id: string;
  user_id: string;
  accion_id: string;
  cantidad: number;
  precio_promedio: number;
  acciones?: {
    simbolo: string;
    nombre: string;
    precio_actual: number;
  };
}

export interface Perfil {
  id: string;
  email?: string;
  nombre?: string;
  saldo: number;
  created_at?: string;
}

export async function getAcciones(): Promise<Accion[]> {
  const response = await fetch(`${API_URL}/api/acciones`);
  if (!response.ok) throw new Error('Error al obtener acciones');
  return response.json();
}

export async function getMisOrdenes(): Promise<Orden[]> {
  const response = await fetch(`${API_URL}/api/mis-ordenes`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener órdenes');
  return response.json();
}

export async function getMiPerfil(): Promise<Perfil> {
  const response = await fetch(`${API_URL}/api/mi-perfil`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener perfil');
  return response.json();
}

export async function getMisPosiciones(): Promise<Posicion[]> {
  const response = await fetch(`${API_URL}/api/mis-posiciones`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Error al obtener posiciones');
  return response.json();
}

export async function crearOrden(accionId: string, tipo: 'compra' | 'venta', cantidad: number): Promise<Orden> {
  const response = await fetch(`${API_URL}/api/ordenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ accion_id: accionId, tipo, cantidad }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error al crear orden');
  }
  
  return data;
}
