import { userService } from "@/services/user.service";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSyncUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const syncMutation = useMutation({
    mutationFn: userService.syncUser,
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    syncMutation.mutate({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      photo: user.imageUrl || "",
      role: "user",
    });
  }, [isLoaded, isSignedIn, user?.id]);

  return syncMutation;
}
