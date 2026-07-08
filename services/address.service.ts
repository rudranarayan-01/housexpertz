import api from "@/lib/api/client";
import { UserAddress } from "@/types/user.types";

export interface AddressPayload {
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  city?: string;
  state?: string;
  pincode: string;
  isDefault?: boolean;
}

export interface AddAddressResponse {
  success: boolean;
  allAddresses: UserAddress[];
}

export interface UpdateAddressResponse {
  success: boolean;
  addresses: UserAddress[];
}

export interface DeleteAddressResponse {
  success: boolean;
  addresses: UserAddress[];
}

export const addressService = {
  async addAddress(clerkId: string, addressData: AddressPayload) {
    if (!clerkId) throw new Error("Clerk ID is required");

    const response = await api.post<AddAddressResponse>("/address/add", {
      clerkId,
      addressData,
    });

    return response.data;
  },

  async updateAddress(
    clerkId: string,
    addressId: string,
    updatedData: AddressPayload,
  ) {
    if (!clerkId) throw new Error("Clerk ID is required");
    if (!addressId) throw new Error("Address ID is required");

    const response = await api.put<UpdateAddressResponse>(
      `/address/update/${clerkId}/${addressId}`,
      { updatedData },
    );

    return response.data;
  },

  async deleteAddress(clerkId: string, addressId: string) {
    if (!clerkId) throw new Error("Clerk ID is required");
    if (!addressId) throw new Error("Address ID is required");

    const response = await api.delete<DeleteAddressResponse>(
      `/address/delete/${clerkId}/${addressId}`,
    );

    return response.data;
  },
};
