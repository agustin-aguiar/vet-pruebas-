/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Species = 'Dog' | 'Cat' | 'Exotic' | 'Bird' | 'Rabbit';

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  documentId: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  createdAt: string;
  notes: string;
  tags: string[];
  status: 'Active' | 'Inactive' | 'With Debt';
  preferredContact: 'WhatsApp' | 'Email' | 'Phone';
}

export interface Pet {
  id: string;
  ownerId: string;
  secondaryOwnerIds?: string[];
  name: string;
  photo: string;
  species: Species;
  breed: string;
  sex: 'Male' | 'Female';
  birthDate: string;
  weight: number;
  color: string;
  isSterilized: boolean;
  medicalAlerts: string[];
  allergies: string[];
  currentMedications: string[];
  status: 'Active' | 'Inactive' | 'Deceased';
  clinicalHistoryId: string;
  criticalAlerts?: string; // Added for Dashboard compatibility
  medications?: string[]; // Added for compatibility
}

export interface Appointment {
  id: string;
  petId: string;
  ownerId: string;
  vetId: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'Checkup' | 'Vaccination' | 'Surgery' | 'Emergency' | 'Control';
  status: 'Scheduled' | 'Checked-in' | 'Attended' | 'Cancelled' | 'No-show';
  reason: string;
  notes?: string;
}

export interface ClinicalRecord {
  id: string;
  petId: string;
  vetId: string;
  date: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  instructions: string;
  evolution?: string;
  attachments?: string[];
  type: 'General' | 'Control' | 'Vaccination' | 'Surgery' | 'Emergency';
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  appliedDate: string;
  expiryDate: string;
  status: 'Current' | 'Expiring' | 'Expired' | 'Pending';
}

export interface User {
  id: string;
  name: string;
  role: 'Recepcionista' | 'Veterinario' | 'Administrador';
  email: string;
  avatar: string;
}
