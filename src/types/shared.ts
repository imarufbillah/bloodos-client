/**
 * Shared types, enums, and constants for BloodOS (Client)
 * Mirrored from bloodos-server/src/types/shared.ts
 * Keep in sync with backend types
 */

// ============================================================================
// Blood Group Enum (Req 7.5)
// ============================================================================

export const BloodGroup = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
} as const;

export type BloodGroup = (typeof BloodGroup)[keyof typeof BloodGroup];

export const BLOOD_GROUPS = Object.values(BloodGroup);

// ============================================================================
// District Enum - All 64 Bangladesh Districts (Req 7.2)
// ============================================================================

export const District = {
  // Dhaka Division
  DHAKA: "Dhaka",
  FARIDPUR: "Faridpur",
  GAZIPUR: "Gazipur",
  GOPALGANJ: "Gopalganj",
  KISHOREGANJ: "Kishoreganj",
  MADARIPUR: "Madaripur",
  MANIKGANJ: "Manikganj",
  MUNSHIGANJ: "Munshiganj",
  NARAYANGANJ: "Narayanganj",
  NARSINGDI: "Narsingdi",
  RAJBARI: "Rajbari",
  SHARIATPUR: "Shariatpur",
  TANGAIL: "Tangail",

  // Chittagong Division
  CHITTAGONG: "Chittagong",
  BANDARBAN: "Bandarban",
  BRAHMANBARIA: "Brahmanbaria",
  CHANDPUR: "Chandpur",
  COMILLA: "Comilla",
  COXS_BAZAR: "Cox's Bazar",
  FENI: "Feni",
  KHAGRACHARI: "Khagrachari",
  LAKSHMIPUR: "Lakshmipur",
  NOAKHALI: "Noakhali",
  RANGAMATI: "Rangamati",

  // Rajshahi Division
  RAJSHAHI: "Rajshahi",
  BOGRA: "Bogra",
  JOYPURHAT: "Joypurhat",
  NAOGAON: "Naogaon",
  NATORE: "Natore",
  CHAPAINAWABGANJ: "Chapainawabganj",
  PABNA: "Pabna",
  SIRAJGANJ: "Sirajganj",

  // Khulna Division
  KHULNA: "Khulna",
  BAGERHAT: "Bagerhat",
  CHUADANGA: "Chuadanga",
  JESSORE: "Jessore",
  JHENAIDAH: "Jhenaidah",
  KUSHTIA: "Kushtia",
  MAGURA: "Magura",
  MEHERPUR: "Meherpur",
  NARAIL: "Narail",
  SATKHIRA: "Satkhira",

  // Barisal Division
  BARISAL: "Barisal",
  BARGUNA: "Barguna",
  BHOLA: "Bhola",
  JHALOKATI: "Jhalokati",
  PATUAKHALI: "Patuakhali",
  PIROJPUR: "Pirojpur",

  // Sylhet Division
  SYLHET: "Sylhet",
  HABIGANJ: "Habiganj",
  MOULVIBAZAR: "Moulvibazar",
  SUNAMGANJ: "Sunamganj",

  // Rangpur Division
  RANGPUR: "Rangpur",
  DINAJPUR: "Dinajpur",
  GAIBANDHA: "Gaibandha",
  KURIGRAM: "Kurigram",
  LALMONIRHAT: "Lalmonirhat",
  NILPHAMARI: "Nilphamari",
  PANCHAGARH: "Panchagarh",
  THAKURGAON: "Thakurgaon",

  // Mymensingh Division
  MYMENSINGH: "Mymensingh",
  JAMALPUR: "Jamalpur",
  NETROKONA: "Netrokona",
  SHERPUR: "Sherpur",
} as const;

export type District = (typeof District)[keyof typeof District];

export const DISTRICTS = Object.values(District);

// ============================================================================
// Request Status Enum (Req 3.1-3.9)
// ============================================================================

export const RequestStatus = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  FULFILLED: "fulfilled",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const REQUEST_STATUSES = Object.values(RequestStatus);

// ============================================================================
// Urgency Enum
// ============================================================================

export const Urgency = {
  CRITICAL: "critical",
  URGENT: "urgent",
  MODERATE: "moderate",
} as const;

export type Urgency = (typeof Urgency)[keyof typeof Urgency];

export const URGENCIES = Object.values(Urgency);

// ============================================================================
// Response Status Enum (Req 6)
// ============================================================================

export const ResponseStatus = {
  OFFERED: "offered",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  COMPLETED: "completed",
} as const;

export type ResponseStatus =
  (typeof ResponseStatus)[keyof typeof ResponseStatus];

export const RESPONSE_STATUSES = Object.values(ResponseStatus);

// ============================================================================
// Notification Type Enum (Req 9.12)
// ============================================================================

export const NotificationType = {
  NEW_RESPONSE: "new_response",
  RESPONSE_STATUS_CHANGE: "response_status_change",
  REQUEST_STATUS_CHANGE: "request_status_change",
  NEW_MATCHING_REQUEST: "new_matching_request",
  DONATION_VERIFIED: "donation_verified",
  REQUEST_EXPIRING_SOON: "request_expiring_soon",
  SYSTEM_ANNOUNCEMENT: "system_announcement",
  CONTACT_INFO_REQUESTED: "contact_info_requested",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NOTIFICATION_TYPES = Object.values(NotificationType);

// ============================================================================
// User Role Enum (Req 1.8)
// ============================================================================

export const UserRole = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLES = Object.values(UserRole);

// ============================================================================
// Admin Action Type Enum (Req 10.1)
// ============================================================================

export const AdminActionType = {
  APPROVE_REQUEST: "approve_request",
  REJECT_REQUEST: "reject_request",
  MODIFY_REQUEST: "modify_request",
  VERIFY_DONATION: "verify_donation",
  BAN_USER: "ban_user",
  UNBAN_USER: "unban_user",
  CHANGE_USER_ROLE: "change_user_role",
} as const;

export type AdminActionType =
  (typeof AdminActionType)[keyof typeof AdminActionType];

export const ADMIN_ACTION_TYPES = Object.values(AdminActionType);

// ============================================================================
// Error Response Type (Req 11.1)
// ============================================================================

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
}

// ============================================================================
// Paginated Response Type (Req 12.1)
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================================================
// Blood Request Interface (Client representation)
// ============================================================================

export interface BloodRequest {
  _id: string;
  userId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  district: District;
  urgency: Urgency;
  status: RequestStatus;
  neededByDate: string; // ISO date string
  contactPhone: string;
  additionalNotes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ============================================================================
// Donor Interface (Client representation)
// ============================================================================

export interface Donor {
  _id: string;
  name: string;
  bloodGroup: BloodGroup;
  district: District;
  phone: string; // Masked by default (Req 17.5)
  email?: string; // Masked by default
  lastDonationDate: string | null; // ISO date string
  isDonor: boolean;
  createdAt: string; // ISO date string
}

// ============================================================================
// Sort Options
// ============================================================================

export const SortOption = {
  NEWEST: "newest",
  OLDEST: "oldest",
  MOST_URGENT: "most_urgent",
  CRITICAL_FIRST: "critical_first",
} as const;

export type SortOption = (typeof SortOption)[keyof typeof SortOption];
