'use client';

import LoginPage from '../../views/LoginPage';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const user = await res.json();
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      router.push('/dashboard');
      return true;
    } catch {
      return false;
    }
  };

  return <LoginPage onLogin={handleLogin} isStandalone />;
}
