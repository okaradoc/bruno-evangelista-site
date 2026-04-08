/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, ReactNode } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { PropertyDetails } from './pages/PropertyDetails';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Gatekeeper } from './pages/Gatekeeper';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { supabase } from './lib/supabase';

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const [isValidated, setIsValidated] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Check Gatekeeper validation
    const token = sessionStorage.getItem('gatekeeper_token');
    setIsValidated(token === 'access_granted_be');

    // 2. Check Supabase Auth if required
    const checkAuth = async () => {
      try {
        if (requireAuth) {
          const { data: { session } } = await supabase.auth.getSession();
          setIsAuthenticated(!!session);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [requireAuth, location]);

  if (isValidated === null || isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-copper-500"></div></div>;
  }

  // If not validated by gatekeeper, show gatekeeper
  if (!isValidated) {
    return <Gatekeeper onValidated={() => setIsValidated(true)} />;
  }

  // If validated but not authenticated (and auth is required), redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/acesso-restrito-be" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-petroleum-900 font-sans selection:bg-copper-500 selection:text-white flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/imovel/:id" element={<PropertyDetails />} />
            
            {/* Obfuscated Admin Routes */}
            <Route 
              path="/acesso-restrito-be" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <AdminLogin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gestao-interna-be" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Redirect old routes to home or 404 to avoid enumeration */}
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/painel" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}
