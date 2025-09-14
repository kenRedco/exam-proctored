export type Role = 'user' | 'proctor' | 'admin';

export interface User {
  _id: string;
  role: Role;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  timezone?: string;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamType {
  _id: string;
  slug: string;
  name: string;
  provider?: string;
  durationMinutes?: number;
  prepCategory?: string;
  requirements?: string[];
  basePrice: number; // minor units
  currency: string; // ISO code
  enabled: boolean;
}

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'disputed';

export interface BookingPricing {
  currency: string;
  totalMinor: number;
  upfrontMinor: number;
  remainingMinor: number;
  discountsMinor?: number;
}

export interface BookingMeeting {
  provider: 'zoom' | 'gmeet' | 'jitsi' | 'other';
  url?: string;
  passcode?: string;
}

export interface BookingChecklist {
  idVerified: boolean;
  roomScanOk: boolean;
  techCheckOk: boolean;
  notes?: string;
}

export interface BookingHistoryItem {
  at: string;
  action: string;
  by?: string;
  note?: string;
}

export interface AttachmentRef {
  key: string;
  name: string;
  type?: string;
}

export interface Booking {
  _id: string;
  userId: string;
  examTypeId: string;
  preferredStartAt: string;
  timezone?: string;
  country?: string;
  language?: string;
  status: BookingStatus;
  assignedProctorId?: string;
  meeting?: BookingMeeting;
  checklist?: BookingChecklist;
  pricing: BookingPricing;
  payment?: {
    upfrontPaymentId?: string;
    remainingPaymentId?: string;
    remainingDueAt?: string;
  };
  history?: BookingHistoryItem[];
  attachments?: AttachmentRef[];
  createdAt: string;
  updatedAt: string;
}

export type PaymentType = 'upfront' | 'remaining';
export type PaymentProvider = 'stripe' | 'paypal' | 'mpesa' | 'flutterwave';
export type PaymentStatus =
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'void';

export interface Payment {
  _id: string;
  bookingId: string;
  userId: string;
  currency: string;
  amountMinor: number;
  type: PaymentType;
  provider: PaymentProvider;
  externalIds?: Record<string, string>;
  status: PaymentStatus;
  receipts?: { url: string; issuedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  bookingId?: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'inapp' | 'push';
  templateKey: string;
  payload: any;
  status: 'queued' | 'sent' | 'failed';
  error?: string;
  sentAt?: string;
}

export interface Message {
  _id: string;
  bookingId: string;
  from: 'user' | 'proctor' | 'admin' | 'bot';
  text?: string;
  attachments?: AttachmentRef[];
  readBy?: string[];
  createdAt: string;
}

