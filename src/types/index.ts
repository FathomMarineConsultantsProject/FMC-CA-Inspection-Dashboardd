export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
}

export type InspectionType = 'Condition Survey' | 'Pre-Purchase Survey' | 'Damage Survey' | 'Insurance Survey';
export type ShipType = 'Bulk Carrier' | 'Tanker' | 'Container Ship' | 'General Cargo Vessel';
export type InspectionStatus = 'Pending Review' | 'Quote Sent' | 'Quote Approved' | 'Surveyor Assigned' | 'Inspection Completed';
export type SurveyorStatus = 'Active' | 'Busy' | 'On Leave' | 'Unavailable';

export interface InspectionRequest {
  id: string;
  clientId: string;
  clientEmail: string;
  inspectionType: InspectionType;
  shipType: ShipType;
  port: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  status: InspectionStatus;
  createdAt: string;
  surveyorId?: string;
  quoteId?: string;
}

export interface Quote {
  id: string;
  requestId: string;
  clientEmail: string;
  inspectionType: InspectionType;
  port: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Surveyor {
  id: string;
  name: string;
  email: string;
  location: string;
  status: SurveyorStatus;
  phone?: string;
}

export interface PreparationData {
  vesselName: string;
  imoNumber: string;
  flag: string;
  classificationSociety: string;
  lastInspectionDate: string;
  certificateValidity: string;
  complianceIssues: string;
  captainName: string;
  captainPosition: string;
  captainNationality: string;
  crewMembers: { name: string; position: string; nationality: string }[];
  specialFocusAreas: string[];
  captainPhone: string;
  captainEmail: string;
  shipEmail: string;
  ownerCompany: string;
  ownerContact: string;
  shipManagerContact: string;
  chartererContact: string;
}
