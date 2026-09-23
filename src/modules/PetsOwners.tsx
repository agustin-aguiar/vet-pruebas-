import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Plus, 
  Search, 
  MoreVertical, 
  User as UserIcon, 
  Calendar, 
  XCircle, 
  Activity, 
  Syringe, 
  AlertCircle, 
  Pill, 
  History, 
  Stethoscope, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useFirebase } from '../components/FirebaseProvider';
import { firestoreService } from '../services/firestoreService';
import { Pet, Species, Owner } from '../types';

export const PetsOwners = () => {
  const { pets, owners, clinicalRecords } = useFirebase();
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<Species | 'All'>('All');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isNewOwnerModalOpen, setIsNewOwnerModalOpen] = useState(false);
  const [isRegisteringPet, setIsRegisteringPet] = useState(false);
  const [isCreatingOwner, setIsCreatingOwner] = useState(false);
  const [isDeletingPet, setIsDeletingPet] = useState(false);

  // Form states
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Dog' as Species,
    sex: 'Male' as 'Male' | 'Female',
    breed: '',
    ownerId: '',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400'
  });

  const [newOwner, setNewOwner] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentId: '',
    status: 'Active' as 'Active' | 'Inactive' | 'With Debt'
  });

  const handleDeletePet = async (e: React.MouseEvent, petId: string) => {
    e.stopPropagation();
    if (isDeletingPet) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      setIsDeletingPet(true);
      try {
        await firestoreService.deleteDocument('pets', petId);
        if (selectedPet?.id === petId) setSelectedPet(null);
      } catch (error) {
        console.error("Error deleting pet:", error);
        alert("Error al eliminar la mascota.");
      } finally {
        setIsDeletingPet(false);
      }
    }
  };

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const owner = owners.find(o => o.id === pet.ownerId);
      const matchesSearch = 
        pet.name.toLowerCase().includes(search.toLowerCase()) || 
        owner?.firstName.toLowerCase().includes(search.toLowerCase()) ||
        owner?.lastName.toLowerCase().includes(search.toLowerCase());
      const matchesSpecies = speciesFilter === 'All' || pet.species === speciesFilter;
      return matchesSearch && matchesSpecies;
    });
  }, [pets, owners, search, speciesFilter]);

  const handleRegisterPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisteringPet) return;
    if (!newPet.ownerId) {
      alert("Por favor selecciona o crea un dueño primero");
      return;
    }
    if (!newPet.name || !newPet.species) {
      alert("Por favor completa los campos obligatorios (Nombre y Especie)");
      return;
    }

    setIsRegisteringPet(true);
    try {
      console.log("Registering pet...", newPet);
      await firestoreService.addDocument('pets', {
        ...newPet,
        birthDate: new Date().toISOString().split('T')[0],
        weight: 0,
        color: '',
        isSterilized: false,
        medicalAlerts: [],
        allergies: [],
        currentMedications: [],
        status: 'Active',
        clinicalHistoryId: ''
      });
      setIsRegisterModalOpen(false);
      setNewPet({
        name: '',
        species: 'Dog',
        sex: 'Male',
        breed: '',
        ownerId: '',
        photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400'
      });
    } catch (error) {
      console.error("Error in handleRegisterPet:", error);
      alert("Error al registrar la mascota. Por favor verifica tu conexión.");
    } finally {
      setIsRegisteringPet(false);
    }
  };

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingOwner) return;

    // Basic validation before sending to Firebase
    if (!newOwner.firstName || !newOwner.lastName || !newOwner.email) {
      alert("Por favor completa los campos obligatorios (Nombre, Apellido y Email)");
      return;
    }

    setIsCreatingOwner(true);
    try {
      console.log("Creating owner...", newOwner);
      const id = await firestoreService.addDocument('owners', {
        ...newOwner,
        whatsapp: newOwner.phone,
        address: '',
        city: '',
        notes: '',
        tags: [],
        preferredContact: 'WhatsApp',
        status: 'Active'
      });
      if (id) {
        console.log("Owner created with ID:", id);
        setNewPet(prev => ({ ...prev, ownerId: id }));
        setIsNewOwnerModalOpen(false);
        // Reset owner form
        setNewOwner({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          documentId: '',
          status: 'Active'
        });
      }
    } catch (error) {
      console.error("Error in handleCreateOwner:", error);
      alert("Error al crear el dueño. Por favor verifica tu conexión.");
    } finally {
      setIsCreatingOwner(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-on-surface font-headline text-3xl font-bold tracking-tight">Propietarios y Mascotas</h2>
          <p className="text-on-surface-variant font-body mt-1">Gestión centralizada de pacientes y sus responsables.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-on-surface-variant px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 border border-outline-variant hover:bg-surface-container-low transition-colors shadow-sm">
            <Filter size={18} />
            Filtros Avanzados
          </button>
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Registrar Nuevo
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="w-64 hidden xl:block space-y-6">
          <div className="section-card p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Especies</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Dog', 'Cat', 'Exotic', 'Rabbit'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeciesFilter(s as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      speciesFilter === s 
                        ? "bg-primary text-white shadow-sm" 
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    {s === 'All' ? 'Todos' : s === 'Dog' ? 'Perros' : s === 'Cat' ? 'Gatos' : s === 'Exotic' ? 'Exóticos' : 'Conejos'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Alertas</label>
              <div className="space-y-3">
                {['Con Deuda', 'Vacuna Vencida', 'Nuevo Cliente'].map((flag) => (
                  <label key={flag} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{flag}</span>
                    <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre de mascota o dueño..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredPets.map((pet, index) => {
              const owner = owners.find(o => o.id === pet.ownerId);
              return (
                <motion.div 
                  layoutId={pet.id}
                  key={`${pet.id}-${index}`}
                  onClick={() => setSelectedPet(pet)}
                  className="section-card group cursor-pointer hover:border-primary/40 transition-all flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">Activo</span>
                      {pet.medicalAlerts.length > 0 && (
                        <span className="px-3 py-1 bg-tertiary text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">Alerta</span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-headline text-lg font-bold">{pet.name}</h3>
                          <p className="text-sm text-on-surface-variant">{pet.breed} • {pet.species}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => handleDeletePet(e, pet.id)}
                            className="text-on-surface-variant hover:text-tertiary transition-colors p-1"
                            title="Eliminar Paciente"
                          >
                            <XCircle size={18} />
                          </button>
                          <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                          <UserIcon size={14} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Dueño</p>
                          <p className="text-sm font-medium">{owner?.firstName} {owner?.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tight">Última Visita</p>
                          <p className="text-sm font-medium">12 Oct, 2023</p>
                        </div>
                      </div>
                    </div>
                    <button className="mt-6 w-full py-2.5 rounded-lg border border-outline-variant text-primary font-bold text-sm hover:bg-primary/5 transition-colors">
                      Ver Perfil
                    </button>
                  </div>
                </motion.div>
              );
            })}
            
            <div 
              onClick={() => setIsRegisterModalOpen(true)}
              className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-8 text-on-surface-variant/40 hover:text-primary hover:border-primary/40 transition-all cursor-pointer group min-h-[350px]"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <p className="font-bold text-xs uppercase tracking-widest">Registrar Paciente</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isRegisterModalOpen && (
          <div key="modal-register" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black font-headline text-primary">Register New Patient</h3>
                <button onClick={() => setIsRegisterModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleRegisterPet}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Información de la Mascota</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nombre</label>
                        <input 
                          type="text" 
                          required
                          value={newPet.name}
                          onChange={e => setNewPet(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                          placeholder="Ej. Buddy" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Especie</label>
                          <select 
                            value={newPet.species}
                            onChange={e => setNewPet(prev => ({ ...prev, species: e.target.value as Species }))}
                            className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="Dog">Perro</option>
                            <option value="Cat">Gato</option>
                            <option value="Exotic">Exótico</option>
                            <option value="Rabbit">Conejo</option>
                            <option value="Bird">Ave</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sexo</label>
                          <select 
                            value={newPet.sex}
                            onChange={e => setNewPet(prev => ({ ...prev, sex: e.target.value as any }))}
                            className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="Male">Macho</option>
                            <option value="Female">Hembra</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Raza</label>
                        <input 
                          type="text" 
                          value={newPet.breed}
                          onChange={e => setNewPet(prev => ({ ...prev, breed: e.target.value }))}
                          className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                          placeholder="Ej. Golden Retriever" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Información del Dueño</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Seleccionar Dueño Existente</label>
                        <select 
                          value={newPet.ownerId}
                          onChange={e => setNewPet(prev => ({ ...prev, ownerId: e.target.value }))}
                          className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Elegir un dueño...</option>
                          {owners.map(owner => (
                            <option key={owner.id} value={owner.id}>{owner.firstName} {owner.lastName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-center py-2">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">O</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsNewOwnerModalOpen(true)}
                        className="w-full py-2 rounded-lg border border-primary text-primary font-bold text-xs hover:bg-primary/5 transition-colors"
                      >
                        Crear Nuevo Dueño
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-outline-variant/10">
                  <button 
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isRegisteringPet}
                    className={cn(
                      "flex-1 py-3 rounded-xl primary-gradient text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity",
                      isRegisteringPet && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isRegisteringPet ? 'Registrando...' : 'Registrar Paciente'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isNewOwnerModalOpen && (
          <div key="modal-new-owner" className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewOwnerModalOpen(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black font-headline text-primary">Nuevo Dueño</h3>
                <button onClick={() => setIsNewOwnerModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleCreateOwner}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nombre</label>
                    <input 
                      type="text" required
                      value={newOwner.firstName}
                      onChange={e => setNewOwner(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Apellido</label>
                    <input 
                      type="text" required
                      value={newOwner.lastName}
                      onChange={e => setNewOwner(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email</label>
                  <input 
                    type="email" required
                    value={newOwner.email}
                    onChange={e => setNewOwner(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Teléfono</label>
                  <input 
                    type="tel" required
                    value={newOwner.phone}
                    onChange={e => setNewOwner(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-surface-container-low border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsNewOwnerModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreatingOwner}
                    className={cn(
                      "flex-1 py-3 rounded-xl primary-gradient text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity",
                      isCreatingOwner && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCreatingOwner ? 'Guardando...' : 'Guardar Dueño'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {selectedPet && (
          <div key="modal-pet-detail" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPet(null)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={selectedPet.id}
              className="relative w-full max-w-5xl bg-surface rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-full"
            >
              <div className="relative h-64 shrink-0">
                <img src={selectedPet.photo} alt={selectedPet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setSelectedPet(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <XCircle size={24} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl font-black font-headline">{selectedPet.name}</h2>
                      <p className="text-lg opacity-90">{selectedPet.breed} • {selectedPet.species}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold text-sm hover:bg-white/40 transition-colors">Editar Perfil</button>
                      <button className="bg-primary px-6 py-2 rounded-full font-bold text-sm shadow-lg">Nuevo Turno</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Edad', value: '4 años', icon: Calendar },
                    { label: 'Peso', value: `${selectedPet.weight} kg`, icon: Activity },
                    { label: 'Sexo', value: selectedPet.sex === 'Male' ? 'Macho' : 'Hembra', icon: UserIcon },
                    { label: 'Estado', value: 'Al día', icon: Syringe, color: 'text-primary' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-low p-4 rounded-lg text-center space-y-1">
                      <stat.icon size={20} className="mx-auto text-primary opacity-60" />
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
                      <p className={cn("text-xl font-black font-headline", stat.color || "text-on-surface")}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-tertiary-container/10 border-2 border-tertiary/20 p-6 rounded-lg relative overflow-hidden">
                      <h3 className="text-lg font-headline font-extrabold text-tertiary flex items-center gap-2 mb-4">
                        <AlertCircle size={20} />
                        Alertas Críticas
                      </h3>
                      <div className="space-y-2">
                        {selectedPet.allergies.length > 0 ? selectedPet.allergies.map((a, idx) => (
                          <div key={`${a}-${idx}`} className="bg-white/80 backdrop-blur p-3 rounded-lg border border-tertiary/20">
                            <p className="text-tertiary font-bold uppercase tracking-tight">{a}</p>
                            <p className="text-tertiary/70 text-xs">Reacción severa notada en historial.</p>
                          </div>
                        )) : <p className="text-xs text-on-surface-variant">Sin alergias registradas.</p>}
                        {selectedPet.medicalAlerts.map((a, idx) => (
                          <div key={`${a}-${idx}`} className="bg-white/80 backdrop-blur p-3 rounded-lg border border-tertiary/20">
                            <p className="text-tertiary font-bold uppercase tracking-tight">{a}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-surface-container-low p-6 rounded-lg">
                      <h3 className="text-lg font-headline font-extrabold text-on-surface flex items-center gap-2 mb-4">
                        <Pill size={20} />
                        Medicamentos Activos
                      </h3>
                      <div className="space-y-3">
                        {selectedPet.currentMedications.length > 0 ? selectedPet.currentMedications.map((m, idx) => (
                          <div key={`${m}-${idx}`} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg shadow-sm">
                            <p className="font-bold text-sm">{m}</p>
                            <ChevronRight size={16} className="text-on-surface-variant opacity-30" />
                          </div>
                        )) : <p className="text-xs text-on-surface-variant">Sin medicamentos activos.</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-surface-container-low p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
                          <History size={20} />
                          Eventos Médicos Recientes
                        </h3>
                        <button className="text-primary font-bold text-xs hover:underline">Historial Completo</button>
                      </div>
                      <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-outline-variant/30">
                        {clinicalRecords.filter(r => r.petId === selectedPet.id).length > 0 ? clinicalRecords.filter(r => r.petId === selectedPet.id).map((record, idx) => (
                          <div key={`${record.id}-${idx}`} className="relative pl-8">
                            <div className="absolute left-0 top-1 w-6 h-6 bg-primary-container rounded-full flex items-center justify-center ring-4 ring-surface-container-low text-white">
                              <Stethoscope size={12} />
                            </div>
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-bold">{record.reason}</p>
                              <time className="text-[10px] font-bold text-primary uppercase">{record.date}</time>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">{record.diagnosis}</p>
                          </div>
                        )) : <p className="text-xs text-on-surface-variant pl-8">Sin registros médicos previos.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
