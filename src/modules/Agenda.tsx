import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Plus, X, Clock, User, PawPrint, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../components/FirebaseProvider';
import { firestoreService } from '../services/firestoreService';
import { Appointment } from '../types';

export const Agenda = () => {
  const { appointments, pets, owners } = useFirebase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    petId: '',
    ownerId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'Checkup' as Appointment['type'],
    reason: '',
    duration: 30
  });
  
  const days = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newAppointment.petId) {
      alert("Por favor selecciona una mascota");
      return;
    }
    setIsSubmitting(true);
    try {
      await firestoreService.addDocument('appointments', {
        ...newAppointment,
        status: 'Scheduled',
        vetId: 'u1' // Mock vet ID
      });
      setIsModalOpen(false);
      setNewAppointment({
        petId: '',
        ownerId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00',
        type: 'Checkup',
        reason: '',
        duration: 30
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-on-surface font-headline text-3xl font-bold tracking-tight">Agenda</h2>
          <p className="text-on-surface-variant font-body mt-1">{format(new Date(), 'MMMM yyyy')} • Horario Semanal</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-outline-variant shadow-sm">
            <button className="px-6 py-2 text-sm font-semibold rounded-lg hover:bg-surface-container-low transition-colors">Día</button>
            <button className="px-6 py-2 text-sm font-bold rounded-lg bg-primary text-white shadow-sm">Semana</button>
            <button className="px-6 py-2 text-sm font-semibold rounded-lg hover:bg-surface-container-low transition-colors">Mes</button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nuevo Turno
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-outline-variant shadow-sm">
        <div className="grid grid-cols-8 border-b border-outline-variant bg-surface-container-low">
          <div className="py-4 text-center"></div>
          {days.map((day, i) => (
            <div key={i} className={cn(
              "py-4 text-center font-headline font-bold text-sm",
              format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"
            )}>
              {format(day, 'EEE dd')}
            </div>
          ))}
        </div>
        
        <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
          <div className="grid grid-cols-8 relative">
            <div className="col-span-1 border-r border-outline-variant">
              {hours.map(hour => (
                <div key={hour} className="h-20 flex items-center justify-center text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest border-b border-outline-variant bg-surface-container-low/30">
                  {hour}:00
                </div>
              ))}
            </div>
            
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="col-span-1 relative border-r border-outline-variant last:border-r-0">
                {hours.map(hour => (
                  <div key={hour} className="h-20 border-b border-outline-variant"></div>
                ))}
                
                {/* Real Appointments on Calendar */}
                {appointments
                  .filter(apt => apt.date === format(day, 'yyyy-MM-dd'))
                  .map((apt, idx) => {
                    const hour = parseInt(apt.time.split(':')[0]);
                    const minute = parseInt(apt.time.split(':')[1]);
                    const top = (hour - 8) * 80 + (minute / 60) * 80;
                    const pet = pets.find(p => p.id === apt.petId);
                    
                    return (
                      <div 
                        key={`${apt.id}-${idx}`}
                        style={{ top: `${top}px` }}
                        className="absolute left-1 right-1 h-16 bg-primary/10 text-primary p-2 rounded-lg shadow-sm border-l-4 border-primary text-[10px] overflow-hidden cursor-pointer hover:bg-primary/20 transition-all z-10"
                      >
                        <p className="font-bold">{apt.time}</p>
                        <p className="font-black truncate">{pet?.name || 'Mascota'} ({apt.type})</p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black font-headline text-primary">Nuevo Turno</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleCreateAppointment}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                        <CalendarIcon size={12} /> Fecha
                      </label>
                      <input 
                        type="date" required
                        value={newAppointment.date}
                        onChange={e => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> Hora
                      </label>
                      <input 
                        type="time" required
                        value={newAppointment.time}
                        onChange={e => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                      <PawPrint size={12} /> Seleccionar Mascota
                    </label>
                    <select 
                      required
                      value={newAppointment.petId}
                      onChange={e => {
                        const pet = pets.find(p => p.id === e.target.value);
                        setNewAppointment(prev => ({ ...prev, petId: e.target.value, ownerId: pet?.ownerId || '' }));
                      }}
                      className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Elegir paciente...</option>
                      {pets.map(pet => (
                        <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                      <User size={12} /> Veterinario
                    </label>
                    <select className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20">
                      <option value="u1">Dra. Sarah Smith</option>
                      <option value="u2">Dr. James Wilson</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Motivo de Consulta</label>
                    <textarea 
                      value={newAppointment.reason}
                      onChange={e => setNewAppointment(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                      placeholder="Síntomas, control, cirugía..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 py-3 rounded-xl primary-gradient text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? 'Agendando...' : 'Agendar Turno'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
