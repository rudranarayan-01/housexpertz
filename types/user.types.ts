export interface UserAddress {
  _id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  city?: string;
  state?: string;
  pincode: string;
  isDefault: boolean;
}

export interface AppUser {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  role: "user" | "admin" | string;
  addresses: UserAddress[];
  orders: any[];
  createdAt: string;
  updatedAt: string;
}

export interface SyncUserPayload {
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  role?: "user" | "admin" | string;
}

export interface SyncUserResponse {
  success: boolean;
  user: AppUser;
}
