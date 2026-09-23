import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './modules/Dashboard';
import { PetsOwners } from './modules/PetsOwners';
import { Agenda } from './modules/Agenda';
import { MedicalRecords } from './modules/MedicalRecords';
import { Administration } from './modules/Administration';
import { FirebaseProvider, useFirebase } from './components/FirebaseProvider';
import firebaseConfig from '../firebase-applet-config.json';
import { LogIn, AlertTriangle } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading, login } = useFirebase();

  const isConfigured = firebaseConfig.apiKey !== 'PLACEHOLDER_API_KEY';

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-outline-variant shadow-lg text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
            <LogIn size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black font-headline text-on-surface">VetCare CRM</h1>
            <p className="text-on-surface-variant mt-2">Inicie sesión para acceder al sistema de gestión clínica.</p>
          </div>
          
          {!isConfigured && (
            <div className="bg-tertiary/10 p-4 rounded-lg flex items-start gap-3 text-left border border-tertiary/20">
              <AlertTriangle className="text-tertiary shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-tertiary uppercase tracking-widest">Configuración Requerida</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Firebase no está configurado. Por favor, actualice <code>firebase-applet-config.json</code> con sus credenciales.
                </p>
              </div>
            </div>
          )}

          <button 
            onClick={login}
            disabled={!isConfigured}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar con Google
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'pets': return <PetsOwners />;
      case 'agenda': return <Agenda />;
      case 'medical': return <MedicalRecords />;
      case 'admin': return <Administration />;
      default: return <Dashboard />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'pets': return 'Propietarios y Mascotas';
      case 'agenda': return 'Agenda';
      case 'medical': return 'Historias Clínicas';
      case 'admin': return 'Administración';
      default: return 'VetCare CRM';
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        <Header title={getTitle()} />
        <div className="p-8 flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
