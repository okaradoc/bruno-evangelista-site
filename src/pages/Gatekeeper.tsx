import { useState, FormEvent } from 'react';
import { ShieldAlert } from 'lucide-react';

interface GatekeeperProps {
  onValidated: () => void;
}

export function Gatekeeper({ onValidated }: GatekeeperProps) {
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use absolute URL in production (when running from the single HTML file)
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname.includes('.run.app') 
        ? '/api/validate-master-access' 
        : 'https://ais-dev-negsq2ahtzig6ejndprpzt-59166774139.us-east1.run.app/api/validate-master-access'; // Fallback to current dev URL for the exported file

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, honeypot })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store validation in session storage (not local storage for better security)
        sessionStorage.setItem('gatekeeper_token', data.token);
        onValidated();
      } else {
        setError(data.error || 'Acesso negado.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-petroleum-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-2xl border border-white/10">
        <div className="flex justify-center mb-8">
          <div className="bg-copper-50 p-5 rounded-full">
            <ShieldAlert className="w-10 h-10 text-copper-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-serif text-petroleum-900 text-center mb-2">Área Restrita</h2>
        <p className="text-gray-500 text-center text-sm mb-8">Identifique-se para continuar.</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm text-sm mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleValidate} className="space-y-6">
          {/* Honeypot field - hidden from users */}
          <div className="hidden" aria-hidden="true">
            <input 
              type="text" 
              name="website_url" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Chave de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              autoFocus
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-sm focus:ring-2 focus:ring-copper-500 focus:border-transparent outline-none transition-all text-center text-xl tracking-widest" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-petroleum-900 text-white font-bold rounded-sm hover:bg-copper-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Validando...' : 'Verificar'}
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-light">
            Acesso monitorado. Tentativas não autorizadas serão registradas.
          </p>
        </div>
      </div>
    </div>
  );
}
