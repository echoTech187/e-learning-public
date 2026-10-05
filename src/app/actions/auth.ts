"use server";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = 'http://e-learning-docker-api-1'; 

export async function dummyLoginAction(formData: FormData) {
  const role = formData.get('role') as string;
  const cookieStore = await cookies();
  const dummyUser = { id: "99999999-9999-4999-a999-999999999999", name: `Test ${role}`, email: `${role}@test.com`, role: role };
  cookieStore.set('token', 'dummy-token-123', { httpOnly: true, path: '/' });
  cookieStore.set('user', JSON.stringify(dummyUser), { httpOnly: false, path: '/' });
  redirect('/beranda');
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password');
  let userRole = '';

  // Intercept for quick demo
  if (email === 'admin@edunusa.id' || email === 'mentor@edunusa.id') {
    const r = email.split('@')[0];
    const cookieStore = await cookies();
    cookieStore.set('token', 'dummy-token', { path: '/' });
    cookieStore.set('user', JSON.stringify({ id: "00000000-0000-4000-a000-000000000099", name: r.toUpperCase(), email: email, role: r }), { path: '/' });
    redirect('/beranda');
  }

  if (!email || !password) return { error: 'Email dan password wajib diisi' };

  try {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store'
    });
    const data = await res.json();
    if (!res.ok) return { error: data.messages?.error || data.message || 'Gagal login' };

    const cookieStore = await cookies();
    cookieStore.set('token', data.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 86400, path: '/' });
    cookieStore.set('user', JSON.stringify(data.user), { httpOnly: false, maxAge: 86400, path: '/' });
    
    userRole = data.user.role;
  } catch (error) {
    return { error: 'Terjadi kesalahan sistem' };
  }

  if (userRole === 'pending') redirect('/onboarding');
  redirect('/beranda');
}

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm_password');

  if (password !== confirmPassword) return { error: 'Konfirmasi password tidak cocok' };

  try {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      cache: 'no-store'
    });
    const data = await res.json();
    if (!res.ok) return { error: typeof data.messages === 'object' ? Object.values(data.messages)[0] : (data.message || 'Gagal mendaftar') };

    const cookieStore = await cookies();
    cookieStore.set('token', data.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 86400, path: '/' });
    cookieStore.set('user', JSON.stringify(data.user), { httpOnly: false, maxAge: 86400, path: '/' });
  } catch (error) {
    return { error: 'Terjadi kesalahan sistem' };
  }
  
  redirect('/onboarding');
}

export async function onboardingAction(prevState: any, formData: FormData) {
  const role = formData.get('role');
  const phone = formData.get('phone');
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userCookie = cookieStore.get('user')?.value;
    if (!token || !userCookie) return { error: 'Sesi tidak valid, silakan login ulang' };
    
    const user = JSON.parse(userCookie);
    const res = await fetch(`${API_URL}/api/v1/auth/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ user_id: user.id, role: role, phone: phone }),
      cache: 'no-store'
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || 'Gagal menyimpan profil' };

    cookieStore.set('token', data.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 86400, path: '/' });
    cookieStore.set('user', JSON.stringify(data.user), { httpOnly: false, maxAge: 86400, path: '/' });
  } catch (error) {
    return { error: 'Terjadi kesalahan sistem' };
  }

  redirect('/beranda');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('user');
  redirect('/masuk');
}

export async function checkAuthForCheckout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userStr = cookieStore.get('user')?.value;
  
  if (!token || !userStr) {
    return { success: false, error: 'Silakan login terlebih dahulu untuk melanjutkan pembelian.' };
  }
  
  try {
    const user = JSON.parse(userStr);
    // Asumsi: Jika ada field status, harus 'aktif' (untuk dummy login kita anggap aktif)
    if (user.status && user.status !== 'aktif' && user.status !== 'active') {
      return { success: false, error: 'Status akun Anda tidak aktif. Hubungi admin.' };
    }
    return { success: true };
  } catch(e) {
    return { success: false, error: 'Sesi tidak valid.' };
  }
}
