import React, { useState } from 'react';
import { FileText, Stethoscope, Calendar, User, Pill, Activity, ChevronRight, Search, Plus, X, Download, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../components/FirebaseProvider';
import { firestoreService } from '../services/firestoreService';
import { ClinicalRecord } from '../types';

export const MedicalRecords = () => {
  const { clinicalRecords, pets, owners } = useFirebase();
  const [selectedRecord, setSelectedRecord] = useState<ClinicalRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const [newRecord, setNewRecord] = useState({
    petId: '',
    date: new Date().toISOString().split('T')[0],
    reason: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medication: '',
    instructions: '',
    type: 'General' as ClinicalRecord['type']
  });

  const filteredRecords = clinicalRecords.filter(record => {
    const pet = pets.find(p => p.id === record.petId);
    return (
      pet?.name.toLowerCase().includes(search.toLowerCase()) ||
      record.reason.toLowerCase().includes(search.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newRecord.petId) {
      alert("Por favor selecciona una mascota");
      return;
    }
    setIsSubmitting(true);
    try {
      await firestoreService.addDocument('clinicalRecords', {
        ...newRecord,
        vetId: 'u1' // Mock vet ID
      });
      setIsModalOpen(false);
      setNewRecord({
        petId: '',
        date: new Date().toISOString().split('T')[0],
        reason: '',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        medication: '',
        instructions: '',
        type: 'General'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-on-surface font-headline text-3xl font-bold tracking-tight">Historias Clínicas</h2>
          <p className="text-on-surface-variant font-body mt-1">Historial clínico completo y reportes de diagnóstico.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Nueva Historia Clínica
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="section-card p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={16} />
              <input 
                type="text" 
                placeholder="Buscar registros..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">Registros Recientes</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredRecords.map((record, idx) => {
                const pet = pets.find(p => p.id === record.petId);
                return (
                  <div 
                    key={`${record.id}-${idx}`} 
                    onClick={() => setSelectedRecord(record)}
                    className={cn(
                      "p-4 rounded-lg border transition-all cursor-pointer group",
                      selectedRecord?.id === record.id 
                        ? "bg-primary text-white border-primary shadow-sm" 
                        : "bg-white border-outline-variant hover:bg-surface-container-low"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        selectedRecord?.id === record.id ? "text-white/80" : "text-primary"
                      )}>{record.date}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                        selectedRecord?.id === record.id ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant"
                      )}>{record.type}</span>
                    </div>
                    <h4 className="font-bold text-sm">{pet?.name || 'Mascota'} - {record.reason}</h4>
                    <p className={cn(
                      "text-xs mt-1 line-clamp-2",
                      selectedRecord?.id === record.id ? "text-white/70" : "text-on-surface-variant"
                    )}>{record.diagnosis}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedRecord ? (
            <div className="section-card p-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-outline-variant">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Stethoscope size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-headline">{selectedRecord.reason}</h3>
                    <p className="text-on-surface-variant flex items-center gap-2 text-sm">
                      <Calendar size={16} /> {selectedRecord.date} • {selectedRecord.type}
                    </p>
                  </div>
                </div>
                <button className="bg-white border border-outline-variant text-on-surface-variant px-6 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-surface-container-low transition-colors">Imprimir Reporte</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Paciente</h4>
                    <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-4 border border-outline-variant/50">
                      <img 
                        src={pets.find(p => p.id === selectedRecord.petId)?.photo} 
                        alt="Pet" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold">{pets.find(p => p.id === selectedRecord.petId)?.name}</p>
                        <p className="text-xs text-on-surface-variant">{pets.find(p => p.id === selectedRecord.petId)?.breed}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Diagnóstico</h4>
                    <p className="text-on-surface leading-relaxed bg-surface-container-low p-4 rounded-lg border-l-4 border-primary border border-outline-variant/50">
                      {selectedRecord.diagnosis}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Plan de Tratamiento</h4>
                    <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50">
                      <p className="text-sm">{selectedRecord.treatment}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Notas</h4>
                    <p className="text-sm text-on-surface-variant italic">
                      "El paciente mostró buena respuesta al examen inicial. Seguimiento en 48 horas si los síntomas persisten."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Pill size={18} className="text-primary" />
                  Medicamentos Prescritos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">Amoxicilina 250mg</p>
                      <p className="text-[10px] text-on-surface-variant">1 tableta cada 12 horas</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">5 Días</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">Meloxicam 1.5mg</p>
                      <p className="text-[10px] text-on-surface-variant">0.5ml una vez al día con comida</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">3 Días</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="section-card p-10 min-h-[600px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant/20">
                <FileText size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Seleccione un registro para ver detalles</h3>
                <p className="text-on-surface-variant max-w-xs mx-auto mt-2">Elija un paciente de la lista o busque por ID de historia clínica específica.</p>
              </div>
            </div>
          )}
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
              className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black font-headline text-primary">Nuevo Registro Médico</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleSaveRecord}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Seleccionar Paciente</label>
                      <select 
                        required
                        value={newRecord.petId}
                        onChange={e => setNewRecord(prev => ({ ...prev, petId: e.target.value }))}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Elegir paciente...</option>
                        {pets.map(pet => (
                          <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tipo de Consulta</label>
                      <select 
                        value={newRecord.type}
                        onChange={e => setNewRecord(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="General">Control General</option>
                        <option value="Emergency">Emergencia</option>
                        <option value="Surgery">Cirugía</option>
                        <option value="Vaccination">Vacunación</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Motivo de Visita</label>
                      <input 
                        type="text" required
                        value={newRecord.reason}
                        onChange={e => setNewRecord(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                        placeholder="Ej. Tos persistente" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fecha</label>
                      <input 
                        type="date" required
                        value={newRecord.date}
                        onChange={e => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Diagnóstico</label>
                  <textarea 
                    required
                    value={newRecord.diagnosis}
                    onChange={e => setNewRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                    className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                    placeholder="Describe los hallazgos clínicos..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Plan de Tratamiento</label>
                  <textarea 
                    value={newRecord.treatment}
                    onChange={e => setNewRecord(prev => ({ ...prev, treatment: e.target.value }))}
                    className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                    placeholder="Pasos para la recuperación, medicamentos, etc."
                  ></textarea>
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
                    {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
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
