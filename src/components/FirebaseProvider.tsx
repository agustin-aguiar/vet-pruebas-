import React, { createContext, useContext, useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getDocFromServer, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { firestoreService } from '../services/firestoreService';
import { Owner, Pet, Appointment, ClinicalRecord } from '../types';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  owners: Owner[];
  pets: Pet[];
  appointments: Appointment[];
  clinicalRecords: ClinicalRecord[];
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let message = "Algo salió mal. Por favor, intenta recargar la página.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.error.includes("insufficient permissions")) {
          message = "Error de permisos: No tienes autorización para realizar esta acción o ver estos datos.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-tertiary/20 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto text-tertiary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h2 className="text-xl font-bold text-on-surface">¡Ups! Algo salió mal</h2>
            <p className="text-on-surface-variant text-sm">{message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test connection to Firestore as per instructions
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubOwners = firestoreService.subscribeToCollection('owners', setOwners);
    const unsubPets = firestoreService.subscribeToCollection('pets', setPets);
    const unsubAppointments = firestoreService.subscribeToCollection('appointments', setAppointments);
    const unsubRecords = firestoreService.subscribeToCollection('clinicalRecords', setClinicalRecords);

    return () => {
      unsubOwners();
      unsubPets();
      unsubAppointments();
      unsubRecords();
    };
  }, [user]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      owners,
      pets,
      appointments,
      clinicalRecords
    }}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
