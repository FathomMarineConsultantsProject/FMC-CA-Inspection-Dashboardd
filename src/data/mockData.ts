import { InspectionRequest, Surveyor, Quote, User } from '@/types';

export const mockUsers: User[] = [
  { id: 'client1', email: 'client@shipping.com', name: 'Pacific Shipping Co.', role: 'client', company: 'Pacific Shipping Co.' },
  { id: 'admin1', email: 'admin@fathommarine.com', name: 'Sarah Johnson', role: 'admin', company: 'Fathom Marine Consultants' },
];

export const mockSurveyors: Surveyor[] = [
  { id: 's1', name: 'John Smith', email: 'john@surveyor.com', location: 'Singapore', status: 'Active', phone: '+65 9123 4567' },
  { id: 's2', name: 'Ahmed Khan', email: 'ahmed@surveyor.com', location: 'Dubai', status: 'Active', phone: '+971 50 123 4567' },
  { id: 's3', name: 'Carlos Lopez', email: 'carlos@surveyor.com', location: 'Rotterdam', status: 'Busy', phone: '+31 6 1234 5678' },
  { id: 's4', name: 'Wei Zhang', email: 'wei@surveyor.com', location: 'Shanghai', status: 'On Leave', phone: '+86 139 1234 5678' },
  { id: 's5', name: 'Maria Santos', email: 'maria@surveyor.com', location: 'Lisbon', status: 'Active', phone: '+351 91 234 5678' },
];

export const mockInspections: InspectionRequest[] = [
  {
    id: 'INS-001',
    clientId: 'client1',
    clientEmail: 'client@shipping.com',
    inspectionType: 'Condition Survey',
    shipType: 'Bulk Carrier',
    port: 'Singapore',
    country: 'Singapore',
    dateFrom: '2026-03-15',
    dateTo: '2026-03-20',
    status: 'Pending Review',
    createdAt: '2026-03-10',
  },
  {
    id: 'INS-002',
    clientId: 'client1',
    clientEmail: 'client@shipping.com',
    inspectionType: 'Pre-Purchase Survey',
    shipType: 'Tanker',
    port: 'Rotterdam',
    country: 'Netherlands',
    dateFrom: '2026-03-25',
    dateTo: '2026-03-28',
    status: 'Quote Sent',
    createdAt: '2026-03-08',
    quoteId: 'QT-001',
  },
  {
    id: 'INS-003',
    clientId: 'client1',
    clientEmail: 'client@shipping.com',
    inspectionType: 'Damage Survey',
    shipType: 'Container Ship',
    port: 'Dubai',
    country: 'UAE',
    dateFrom: '2026-04-01',
    dateTo: '2026-04-05',
    status: 'Surveyor Assigned',
    createdAt: '2026-03-01',
    surveyorId: 's2',
    quoteId: 'QT-002',
  },
];

export const mockQuotes: Quote[] = [
  {
    id: 'QT-001',
    requestId: 'INS-002',
    clientEmail: 'client@shipping.com',
    inspectionType: 'Pre-Purchase Survey',
    port: 'Rotterdam',
    amount: 4500,
    status: 'Pending',
    createdAt: '2026-03-09',
  },
  {
    id: 'QT-002',
    requestId: 'INS-003',
    clientEmail: 'client@shipping.com',
    inspectionType: 'Damage Survey',
    port: 'Dubai',
    amount: 6000,
    status: 'Approved',
    createdAt: '2026-03-02',
  },
];

export const INSPECTION_TYPES = ['Condition Survey', 'Pre-Purchase Survey', 'Damage Survey', 'Insurance Survey'] as const;
export const SHIP_TYPES = ['Bulk Carrier', 'Tanker', 'Container Ship', 'General Cargo Vessel'] as const;
export const SPECIAL_FOCUS_OPTIONS = [
  'Engine vibration',
  'Hull corrosion',
  'Safety equipment problems',
  'Navigation equipment issues',
  'Structural damage',
] as const;
