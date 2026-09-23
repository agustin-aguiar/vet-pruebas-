import React from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  LogOut
} from 'lucide-react';
import { useFirebase } from './FirebaseProvider';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const { user, logout } = useFirebase();

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 h-20 w-full bg-surface/85 backdrop-blur-md">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input 
            type="text" 
            placeholder="Buscar mascota, dueño o turno..." 
            className="w-full bg-white border border-outline-variant rounded-lg py-2 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button className="hover:text-primary transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full border-2 border-surface"></span>
          </button>
          <button className="hover:text-primary transition-colors">
            <MessageSquare size={20} />
          </button>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant"></div>
        <button className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-sm">
          + Nuevo Turno
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface leading-tight">{user?.displayName || 'Dr. Julián Martínez'}</p>
            <p className="text-xs text-on-surface-variant">Veterinario Senior</p>
          </div>
          <div className="relative group">
            <img 
              src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
              alt="Profile" 
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
            />
            <button 
              onClick={logout}
              className="absolute top-full right-0 mt-2 bg-white p-2 rounded-lg shadow-xl border border-outline-variant opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold text-tertiary hover:bg-tertiary/5 whitespace-nowrap"
            >
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
