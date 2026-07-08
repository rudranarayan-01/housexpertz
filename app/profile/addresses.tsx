import AddAddressDialog, { AddressFormPayload } from "@/components/address/AddAddressDialog";
import EditAddressDialog, { EditableAddress } from "@/components/address/EditAddressDialog";
import { AddressPayload, addressService } from "@/services/address.service";
import { userService } from "@/services/user.service";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THEME = "#0B132B";

type AddressFilter = "All" | "Home" | "Office" | "Other";

interface AddressItem {
  id: string;
  type: AddressFilter;
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  details: string;
  isDefault: boolean;
}

const normalizeAddressType = (label?: string): AddressFilter => {
  const value = label?.toLowerCase().trim();

  if (value === "home") return "Home";
  if (value === "office" || value === "work") return "Office";

  return "Other";
};

const createAddressDetails = (item: any) => {
  return [item.addressLine, item.city, item.state, item.pincode]
    .filter(Boolean)
    .join(", ");
};

export default function ManageAddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  const isTablet = width >= 768;
  const horizontalPadding = isTablet ? 28 : 16;
  const cardGap = 16;
  const maxContentWidth = 1024;
  const usableWidth = Math.min(width, maxContentWidth);
  const cardWidth = isTablet
    ? (usableWidth - horizontalPadding * 2 - cardGap) / 2
    : width - horizontalPadding * 2;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<AddressFilter>("All");
  const [editingAddress, setEditingAddress] = useState<EditableAddress | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["appUser", user?.id],
    queryFn: () => userService.getUserByClerkId(user!.id),
    enabled: isLoaded && !!user?.id,
  });

  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: ["appUser", user?.id] });
  };

  const addAddressMutation = useMutation({
    mutationFn: (addressData: AddressPayload) =>
      addressService.addAddress(user!.id, addressData),
    onSuccess: () => {
      invalidateUser();
      setShowAddDialog(false);
    },
    onError: (err: Error) => {
      Alert.alert("Unable to add address", err.message);
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) =>
      addressService.deleteAddress(user!.id, addressId),
    onSuccess: invalidateUser,
    onError: (err: Error) => {
      Alert.alert("Unable to delete address", err.message);
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({
      addressId,
      updatedData,
    }: {
      addressId: string;
      updatedData: AddressPayload;
    }) => addressService.updateAddress(user!.id, addressId, updatedData),
    onSuccess: invalidateUser,
    onError: (err: Error) => {
      Alert.alert("Unable to update address", err.message);
    },
  });

  const handleUpdateAddress = (addressId: string, payload: AddressPayload) => {
    updateAddressMutation.mutate(
      {
        addressId,
        updatedData: payload,
      },
      {
        onSuccess: () => {
          setEditingAddress(null);
        },
      }
    );
  };

  const addresses: AddressItem[] = useMemo(() => {
    const apiAddresses = data?.user?.addresses || [];

    return apiAddresses.map((item: any) => ({
      id: item._id,
      type: normalizeAddressType(item.label),
      label: item.label || "Other",
      fullName: item.fullName || "Saved Address",
      phoneNumber: item.phoneNumber || "",
      addressLine: item.addressLine || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || "",
      details: createAddressDetails(item),
      isDefault: !!item.isDefault,
    }));
  }, [data]);

  const filteredAddresses = useMemo(() => {
    return addresses.filter(
      (item) => selectedFilter === "All" || item.type === selectedFilter
    );
  }, [addresses, selectedFilter]);

  const counts = useMemo(() => {
    return {
      All: addresses.length,
      Home: addresses.filter((item) => item.type === "Home").length,
      Office: addresses.filter((item) => item.type === "Office").length,
      Other: addresses.filter((item) => item.type === "Other").length,
    };
  }, [addresses]);

  const handleAddAddress = (data: AddressFormPayload) => {
    const payload: AddressPayload = {
      label: data.type === "Work" ? "Office" : data.type,
      fullName: data.name,
      phoneNumber: "",
      addressLine: data.details,
      city: "",
      state: "",
      pincode: "",
      isDefault: data.isDefault,
    };

    addAddressMutation.mutate(payload);
  };

  const handleSetDefault = (item: AddressItem) => {
    const payload: AddressPayload = {
      label: item.label,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      addressLine: item.addressLine,
      city: item.city,
      state: item.state,
      pincode: item.pincode,
      isDefault: true,
    };

    updateAddressMutation.mutate({
      addressId: item.id,
      updatedData: payload,
    });
  };

  const handleDelete = (item: AddressItem) => {
    Alert.alert(
      "Delete address?",
      "This saved location will be removed from your account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddressMutation.mutate(item.id),
        },
      ]
    );
  };

  const busy =
    addAddressMutation.isPending ||
    updateAddressMutation.isPending ||
    deleteAddressMutation.isPending;

  if (!isLoaded || isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <ActivityIndicator size="large" color={THEME} />
        <Text className="text-slate-400 text-xs font-bold mt-3">
          Loading addresses...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor={THEME} animated />

      <View
        className="bg-[#0B132B] px-5 rounded-b-[36px] z-10"
        style={{ paddingTop: insets.top + 16, paddingBottom: 34 }}
      >
        <View className="max-w-5xl w-full self-center flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-3">
            <Pressable
              onPress={() => router.back()}
              className="w-11 h-11 bg-white/10 rounded-2xl items-center justify-center border border-white/10 active:opacity-70"
            >
              <Ionicons name="arrow-back" size={19} color="white" />
            </Pressable>

            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-black tracking-tight">
                Saved Addresses
              </Text>
              <Text className="text-slate-400 text-xs font-semibold mt-0.5">
                Manage your service locations
              </Text>
            </View>
          </View>

          <Pressable
            disabled={busy}
            onPress={() => setShowAddDialog(true)}
            className="bg-white px-4 py-2.5 rounded-xl flex-row items-center active:opacity-90 disabled:opacity-60"
          >
            <Ionicons name="add" size={16} color={THEME} />
            <Text className="text-[#0B132B] text-xs font-black ml-1.5">
              Add New
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="px-4 -mt-5 z-20">
        <View className="max-w-5xl w-full self-center flex-row gap-2 bg-white rounded-2xl p-2 border border-slate-100">
          {(["All", "Home", "Office", "Other"] as AddressFilter[]).map((filter) => {
            const isSelected = selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`flex-1 py-2.5 rounded-xl items-center ${isSelected ? "bg-[#0B132B]" : "bg-slate-50 active:bg-slate-100"
                  }`}
              >
                <Text
                  className={`text-[11px] font-black ${isSelected ? "text-white" : "text-slate-500"
                    }`}
                >
                  {filter}
                </Text>
                <Text
                  className={`text-[9px] font-bold mt-0.5 ${isSelected ? "text-white/70" : "text-slate-400"
                    }`}
                >
                  {counts[filter]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cloud-offline-outline" size={44} color="#EF4444" />
          <Text className="text-[#0B132B] text-base font-black mt-4">
            Failed to load addresses
          </Text>
          <Text className="text-slate-400 text-xs text-center mt-1 mb-5">
            {(error as Error).message}
          </Text>

          <Pressable
            onPress={() => refetch()}
            className="bg-[#0B132B] px-5 py-3 rounded-2xl"
          >
            <Text className="text-white text-xs font-black">Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredAddresses}
          keyExtractor={(item) => item.id}
          key={isTablet ? "tablet-grid" : "mobile-list"}
          numColumns={isTablet ? 2 : 1}
          columnWrapperStyle={isTablet ? { gap: cardGap } : undefined}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={THEME}
              colors={[THEME]}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 24,
            paddingBottom: insets.bottom + 40,
            maxWidth: maxContentWidth,
            width: "100%",
            alignSelf: "center",
          }}
          ListEmptyComponent={
            <View className="items-center justify-center pt-24 max-w-sm mx-auto w-full">
              <View className="w-16 h-16 bg-slate-100 rounded-2xl items-center justify-center mb-4 border border-slate-200/40">
                <Ionicons name="map-outline" size={26} color="#94A3B8" />
              </View>
              <Text className="text-[#0B132B] text-sm font-black text-center">
                No addresses found
              </Text>
              <Text className="text-slate-400 text-xs font-medium text-center mt-1.5 leading-5">
                Add your home or office address to book services faster.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isUpdatingThis =
              updateAddressMutation.isPending ||
              deleteAddressMutation.isPending;

            return (
              <View
                className="bg-white border border-slate-100 rounded-[24px] p-5"
                style={{
                  width: cardWidth,
                  marginBottom: 14,
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.04,
                  shadowRadius: 16,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-4">
                    <View className="flex-row items-center gap-2 flex-wrap">
                      <View className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg flex-row items-center">
                        <Ionicons
                          name={
                            item.type === "Home"
                              ? "home"
                              : item.type === "Office"
                                ? "business"
                                : "location"
                          }
                          size={12}
                          color="#475569"
                        />
                        <Text className="text-slate-600 text-[9px] font-black ml-1 uppercase">
                          {item.type}
                        </Text>
                      </View>

                      {item.isDefault && (
                        <View className="bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                          <Text className="text-emerald-700 text-[9px] font-black uppercase">
                            Default
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text className="text-[#0B132B] text-sm font-black mt-3">
                      {item.fullName}
                    </Text>

                    <Text className="text-slate-500 text-xs font-medium mt-2 leading-5">
                      {item.details || "Address details not available"}
                    </Text>

                    {!!item.phoneNumber && (
                      <Text className="text-slate-400 text-xs font-bold mt-2">
                        +91 {item.phoneNumber}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    disabled={isUpdatingThis}
                    onPress={() => handleDelete(item)}
                    className="w-9 h-9 rounded-xl bg-red-50 border border-red-100/60 items-center justify-center active:bg-red-100 disabled:opacity-50"
                  >
                    {deleteAddressMutation.isPending ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
                    )}
                  </Pressable>
                </View>

                <View className="flex-row items-center gap-5 mt-5 pt-4 border-t border-slate-100">
                  {!item.isDefault && (
                    <Pressable
                      disabled={busy}
                      onPress={() => handleSetDefault(item)}
                      className="active:opacity-60 disabled:opacity-50"
                    >
                      <Text className="text-[#0B132B] text-xs font-black">
                        Set Default
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    disabled={busy}
                    onPress={() => setEditingAddress(item)}
                    className="active:opacity-60 disabled:opacity-50"
                  >
                    <Text className="text-slate-400 text-xs font-bold">
                      Edit Details
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}

      <AddAddressDialog
        visible={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleAddAddress}
      />
      <EditAddressDialog
        visible={!!editingAddress}
        address={editingAddress}
        isSaving={updateAddressMutation.isPending}
        onClose={() => setEditingAddress(null)}
        onSubmit={handleUpdateAddress}
      />
    </View>
  );
}