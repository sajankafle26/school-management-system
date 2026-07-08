'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const roles = [
  { id: 'admin', label: 'Admin', icon: '👨‍💼', color: 'from-blue-600 to-indigo-700', desc: 'Full system access' },
  { id: 'teacher', label: 'Teacher', icon: '👨‍🏫', color: 'from-green-600 to-emerald-700', desc: 'Manage classes & results' },
  { id: 'student', label: 'Student', icon: '🎓', color: 'from-purple-600 to-violet-700', desc: 'View results & homework' },
  { id: 'parent', label: 'Parent', icon: '👪', color: 'from-orange-600 to-red-600', desc: "Monitor child's progress" },
];

const sampleLogins = [
  { role: 'Admin', username: 'admin', password: 'password' },
  { role: 'Teacher', username: 'T1', password: 'password' },
  { role: 'Student', username: 'S1', password: 'password' },
  { role: 'Parent', username: 'P1', password: 'password' },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }
      const user = await res.json();
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'teacher') router.push('/dashboard/teacher');
      else if (user.role === 'student') router.push('/dashboard/student');
      else if (user.role === 'parent') router.push('/dashboard/parent');
      else router.push('/dashboard/admin');
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  const fillCredentials = (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white">
            <img className="h-8 w-auto" src="https://emojicdn.elk.sh/🇳🇵" alt="Logo" />
            <span className="font-bold text-lg">Shree Adarsha Secondary School</span>
          </Link>
          <Link href="/" className="text-sm text-blue-300 hover:text-white transition-colors">
            ← Back to Website
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Welcome Back</h1>
            <p className="text-blue-200 text-lg">Sign in to access your dashboard</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Role Cards */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Select Your Role</h3>
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? 'bg-white/15 border-white/40 shadow-lg shadow-blue-500/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {role.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-white font-semibold text-lg">{role.label}</div>
                    <div className="text-blue-200 text-sm">{role.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedRole === role.id ? 'border-white bg-white' : 'border-white/30'
                  }`}>
                    {selectedRole === role.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Login Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <h3 className="text-white font-bold text-xl mb-6">Sign In</h3>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              {/* Quick Login */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-3">Quick Login (Demo)</p>
                <div className="grid grid-cols-2 gap-2">
                  {sampleLogins.map(login => (
                    <button
                      key={login.role}
                      onClick={() => fillCredentials(login.username, login.password)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-white text-xs font-medium transition-all text-left"
                    >
                      <span className="block text-blue-300">{login.role}</span>
                      <span className="block text-white/60 mt-0.5">{login.username} / {login.password}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
