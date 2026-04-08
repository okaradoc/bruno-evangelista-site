import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PasswordModal } from '../components/PasswordModal';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/gestao-interna-be');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        navigate('/gestao-interna-be');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-petroleum-50 p-4 rounded-full">
            <Lock className="w-8 h-8 text-copper-600" />
          </div>
        </div>
        <h2 className="text-2xl font-serif text-petroleum-900 text-center mb-8">Área do Corretor</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-petroleum-900 text-white font-medium rounded-sm hover:bg-petroleum-800 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
