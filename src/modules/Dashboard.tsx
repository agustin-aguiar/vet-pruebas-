import React from 'react';
import { 
  CalendarDays, 
  Syringe, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  PawPrint,
  User,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { useFirebase } from '../components/FirebaseProvider';

export const Dashboard = () => {
  const { appointments, pets, owners, clinicalRecords } = useFirebase();

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  const newPetsThisWeek = pets.filter(p => {
    // Mocking creation date check since we don't have it in schema yet
    // In a real app, we'd have a createdAt field
    return true; 
  }).slice(0, 5);

  const stats = [
    { label: 'Turnos del Día', value: todayAppointments.length.toString(), sub: 'Confirmados', icon: CalendarDays, color: 'text-on-surface' },
    { label: 'Pacientes Totales', value: pets.length.toString(), sub: 'En base de datos', icon: PawPrint, color: 'text-on-surface' },
    { label: 'Dueños Registrados', value: owners.length.toString(), sub: 'Clientes activos', icon: User, color: 'text-on-surface' },
    { label: 'Consultas Realizadas', value: clinicalRecords.length.toString(), sub: 'Historial total', icon: Activity, color: 'text-primary' },
  ];

  // Data for Bar Chart: Appointments per day
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const barData = days.map(day => ({
    name: day,
    appointments: Math.floor(Math.random() * 20) + 5 // Mocking for now as we don't have enough historical data
  }));

  // Data for Pie Chart: Species distribution
  const speciesData = [
    { name: 'Perros', value: pets.filter(p => p.species === 'Dog').length, color: '#0d9488' },
    { name: 'Gatos', value: pets.filter(p => p.species === 'Cat').length, color: '#0ea5e9' },
    { name: 'Otros', value: pets.filter(p => p.species !== 'Dog' && p.species !== 'Cat').length, color: '#6366f1' },
  ].filter(d => d.value > 0);

  // Data for Line Chart: Consultations growth
  const lineData = [
    { name: 'Ene', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Abr', value: 61 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 67 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h2 className="text-on-surface font-headline text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-on-surface-variant font-body mt-1">Bienvenido de nuevo, Dr. Julián Martínez.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-surface-container rounded-lg">
                {stat.icon && <stat.icon className={stat.color} size={20} />}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <h3 className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</h3>
              <p className="text-[10px] text-on-surface-variant mt-1">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="section-card">
            <div className="section-header">
              <h4 className="font-headline text-lg font-bold flex items-center">
                <TrendingUp className="mr-2 text-primary" size={20} />
                Agenda Operativa - Hoy
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Hora</th>
                    <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Mascota</th>
                    <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Propietario</th>
                    <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Motivo</th>
                    <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {todayAppointments.length > 0 ? todayAppointments.map((apt, i) => {
                    const pet = pets.find(p => p.id === apt.petId);
                    const owner = owners.find(o => o.id === apt.ownerId);
                    return (
                      <tr key={i} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{apt.time}</td>
                        <td className="px-6 py-4 text-sm font-bold">{pet?.name || 'Mascota'} <span className="font-normal text-on-surface-variant">({pet?.breed})</span></td>
                        <td className="px-6 py-4 text-sm">{owner?.firstName} {owner?.lastName}</td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{apt.reason}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={cn(
                            "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                            apt.status === 'Scheduled' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          )}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant italic text-sm">No hay turnos para hoy.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="section-card">
              <div className="section-header">
                <h4 className="font-headline text-lg font-bold flex items-center">
                  <BarChartIcon className="mr-2 text-primary" size={20} />
                  Actividad Semanal
                </h4>
              </div>
              <div className="p-6 h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="appointments" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h4 className="font-headline text-lg font-bold flex items-center">
                  <Activity className="mr-2 text-primary" size={20} />
                  Crecimiento Mensual
                </h4>
              </div>
              <div className="p-6 h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={3} dot={{ fill: '#0d9488', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="section-card">
            <div className="section-header">
              <h4 className="font-headline text-lg font-bold flex items-center">
                <PieChartIcon className="mr-2 text-primary" size={20} />
                Distribución por Especie
              </h4>
            </div>
            <div className="p-6 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={speciesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {speciesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <h4 className="font-headline text-lg font-bold flex items-center">
                <AlertCircle className="mr-2 text-primary" size={20} />
                Alertas Médicas
              </h4>
            </div>
            <div className="divide-y divide-outline-variant">
              {pets.filter(p => p.criticalAlerts).slice(0, 3).map((pet, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-xl">
                    {pet.species === 'Dog' ? '🐶' : pet.species === 'Cat' ? '🐱' : '🐾'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{pet.name} <span className="text-on-surface-variant font-normal">({pet.breed})</span></h4>
                    <p className="text-xs text-on-surface-variant">{pet.criticalAlerts}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-tertiary">ACCIÓN REQUERIDA</p>
                  </div>
                </div>
              ))}
              {pets.filter(p => p.criticalAlerts).length === 0 && (
                <div className="p-8 text-center text-on-surface-variant italic text-sm">No hay alertas críticas.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
