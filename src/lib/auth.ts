import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('SUPER_SECRET_AEROSPACE_ENCRYPTION_KEY_2026');

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token.value, JWT_SECRET);
    return payload as { id: number, email: string, clearance: number, role: string };
  } catch (err) {
    return null;
  }
}
