import { Owner, Pet, Appointment, ClinicalRecord, Vaccination, User } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Dr. Sarah Smith', role: 'Veterinario', email: 'sarah@vetcare.com', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'u2', name: 'Dr. James Wilson', role: 'Veterinario', email: 'james@vetcare.com', avatar: 'https://i.pravatar.cc/150?u=james' },
  { id: 'u3', name: 'Elena Rodriguez', role: 'Recepcionista', email: 'elena@vetcare.com', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: 'u4', name: 'Admin User', role: 'Administrador', email: 'admin@vetcare.com', avatar: 'https://i.pravatar.cc/150?u=admin' },
];

export const mockOwners: Owner[] = [
  {
    id: 'o1',
    firstName: 'Robert',
    lastName: 'Chen',
    documentId: '12345678',
    phone: '+1 555-0101',
    whatsapp: '+1 555-0101',
    email: 'robert.chen@email.com',
    address: '124 Maplewood Drive, Suite 402',
    city: 'Silver Spring',
    createdAt: '2023-01-15',
    notes: 'Very attentive owner, prefers WhatsApp.',
    tags: ['VIP', 'Loyal'],
    status: 'Active',
    preferredContact: 'WhatsApp',
  },
  {
    id: 'o2',
    firstName: 'Elena',
    lastName: 'Gilbert',
    documentId: '87654321',
    phone: '+1 555-0102',
    whatsapp: '+1 555-0102',
    email: 'elena.g@email.com',
    address: '456 Oak Lane',
    city: 'Mystic Falls',
    createdAt: '2023-05-20',
    notes: 'Has a debt from last surgery.',
    tags: ['Debt'],
    status: 'With Debt',
    preferredContact: 'Email',
  },
];

export const mockPets: Pet[] = [
  {
    id: 'p1',
    ownerId: 'o1',
    name: 'Cooper',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
    species: 'Dog',
    breed: 'Golden Retriever',
    sex: 'Male',
    birthDate: '2019-10-12',
    weight: 32,
    color: 'Golden',
    isSterilized: true,
    medicalAlerts: ['Hip Dysplasia Risk'],
    allergies: ['Penicillin'],
    currentMedications: ['Apoquel 16mg'],
    status: 'Active',
    clinicalHistoryId: 'ch1',
  },
  {
    id: 'p2',
    ownerId: 'o2',
    name: 'Luna',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    sex: 'Female',
    birthDate: '2021-05-24',
    weight: 4.5,
    color: 'Black',
    isSterilized: true,
    medicalAlerts: [],
    allergies: [],
    currentMedications: [],
    status: 'Active',
    clinicalHistoryId: 'ch2',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    petId: 'p1',
    ownerId: 'o1',
    vetId: 'u1',
    date: '2024-04-15',
    time: '09:30',
    duration: 30,
    type: 'Checkup',
    status: 'Scheduled',
    reason: 'Annual checkup and vaccines',
  },
  {
    id: 'a2',
    petId: 'p2',
    ownerId: 'o2',
    vetId: 'u1',
    date: '2024-04-15',
    time: '11:15',
    duration: 15,
    type: 'Vaccination',
    status: 'Scheduled',
    reason: 'Rabies booster',
  },
];

export const mockClinicalRecords: ClinicalRecord[] = [
  {
    id: 'cr1',
    petId: 'p1',
    vetId: 'u1',
    date: '2023-10-14',
    reason: 'Annual Checkup',
    symptoms: 'None',
    diagnosis: 'Optimal Health; Weight stable',
    treatment: 'Routine exam',
    medication: 'None',
    instructions: 'Switch to senior blend kibble in 6 months.',
    type: 'General',
  },
];

export const mockVaccinations: Vaccination[] = [
  { id: 'v1', petId: 'p1', vaccineName: 'Rabies (3-Year)', appliedDate: '2022-10-12', expiryDate: '2025-10-12', status: 'Current' },
  { id: 'v2', petId: 'p1', vaccineName: 'DHPP', appliedDate: '2023-10-14', expiryDate: '2024-10-14', status: 'Current' },
  { id: 'v3', petId: 'p2', vaccineName: 'FVRCP', appliedDate: '2023-05-24', expiryDate: '2024-05-24', status: 'Expiring' },
];
