import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { mockUsers } from '../mockData';

export const Administration = () => {
  const data = [
    { name: 'Consultas', value: 400 },
    { name: 'Vacunas', value: 300 },
    { name: 'Cirugías', value: 200 },
    { name: 'Farmacia', value: 278 },
  ];

  const COLORS = ['#0d9488', '#14b8a6', '#0f172a', '#64748b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h2 className="text-on-surface font-headline text-3xl font-bold tracking-tight">Administración</h2>
        <p className="text-on-surface-variant font-body mt-1">Rendimiento de la clínica, gestión de personal y configuraciones.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="section-card p-8">
          <h3 className="font-headline text-xl font-bold mb-6">Distribución de Ingresos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {data.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-sm font-medium text-on-surface-variant">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card p-8 space-y-6">
          <h3 className="font-headline text-xl font-bold">Gestión de Personal</h3>
          <div className="space-y-4">
            {mockUsers.map(user => (
              <div key={user.id} className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between border border-outline-variant/50">
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-on-surface-variant">{user.role}</p>
                  </div>
                </div>
                <button className="text-primary font-bold text-xs hover:underline">Gestionar</button>
              </div>
            ))}
          </div>
          <button className="w-full py-4 border-2 border-dashed border-outline-variant text-on-surface-variant font-bold text-sm rounded-xl hover:border-primary hover:text-primary transition-all">
            Invitar Nuevo Miembro
          </button>
        </div>
      </div>
    </div>
  );
};
