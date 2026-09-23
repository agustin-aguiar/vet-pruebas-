import React from 'react';
import { 
  LayoutDashboard, 
  PawPrint, 
  Calendar, 
  FileText, 
  Settings, 
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pets', label: 'Propietarios', icon: PawPrint },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'medical', label: 'Historial Clínico', icon: FileText },
    { id: 'admin', label: 'Administración', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col py-8 bg-secondary w-64 z-50 transition-all text-white">
      <div className="px-8 mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Stethoscope size={24} />
        </div>
        <h1 className="text-xl font-black font-headline tracking-tight">VetCRM <span className="text-primary">Pro</span></h1>
      </div>
      
      <nav className="flex-1 space-y-1 font-headline font-semibold tracking-tight text-sm px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full px-4 py-3.5 flex items-center gap-4 transition-all duration-200 text-left rounded-xl group",
              activeTab === item.id 
                ? "bg-white/10 text-white border-l-4 border-primary" 
                : "text-on-secondary-container hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-primary" : "group-hover:text-primary"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4 space-y-4">
        <div className="pt-6 border-t border-white/10 space-y-3 font-headline font-semibold text-sm">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-on-secondary-container hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
            <HelpCircle size={20} />
            Centro de Ayuda
          </button>
          <div className="px-4 py-6 mt-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Clinic Plan</p>
            <p className="text-xs font-medium text-white">Professional SaaS</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
