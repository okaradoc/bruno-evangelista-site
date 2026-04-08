import { useState, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  error?: string;
}

export function PasswordModal({ isOpen, onClose, onConfirm, error }: PasswordModalProps) {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(password);
    setPassword('');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-petroleum-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-petroleum-900 px-6 py-5 flex justify-between items-center border-b border-white/10">
          <h3 className="text-white font-serif text-lg flex items-center">
            <Lock className="w-5 h-5 mr-2 text-copper-400" />
            Acesso Restrito
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 text-sm mb-4">
            Digite a senha de acesso à área do corretor para continuar.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-6">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha..."
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-copper-500 focus:border-copper-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-copper-600 text-white font-medium rounded-sm hover:bg-copper-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
