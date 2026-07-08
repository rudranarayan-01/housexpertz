import api from "@/lib/api/client";
import { AppUser, SyncUserPayload, SyncUserResponse } from "@/types/user.types";

export interface GetUserResponse {
  success: boolean;
  user: AppUser;
}

export const userService = {
  async syncUser(payload: SyncUserPayload): Promise<SyncUserResponse> {
    if (!payload.clerkId) {
      throw new Error("Clerk ID is required to sync user");
    }

    const response = await api.post<SyncUserResponse>(
      "/auth/sync-user",
      payload,
    );
    return response.data;
  },

  async getUserByClerkId(clerkId: string): Promise<GetUserResponse> {
    if (!clerkId) {
      throw new Error("Clerk ID is required");
    }

    const response = await api.get<GetUserResponse>(
      `/user/get-user/${clerkId}`,
    );

    return response.data;
  },
};
