import { orderService } from "@/services/orderService";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Linking,
    Pressable,
    RefreshControl,
    StatusBar,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OrderItem {
  serviceId?: string;
  name?: string;
  price?: number;
  image?: string;
  _id?: string;
}

interface Order {
  _id: string;
  orderId?: string;
  userId?: string;
  items?: OrderItem[];
  status?: "pending" | "completed" | "cancelled" | string;
  totalAmount?: number;
  bookingDate?: string;
  serviceFee?: number;
  assignedPartner?: string | null;
  customerDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

type FilterType = "All" | "Active" | "Completed" | "Cancelled";

const fallbackImage =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300";

const getStatusConfig = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return {
        label: "Active",
        color: "#2563EB",
        bg: "#EFF6FF",
        icon: "clock-outline",
      };
    case "completed":
      return {
        label: "Completed",
        color: "#16A34A",
        bg: "#DCFCE7",
        icon: "checkbox-marked-circle-outline",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "#DC2626",
        bg: "#FEE2E2",
        icon: "close-circle-outline",
      };
    default:
      return {
        label: status || "Unknown",
        color: "#475569",
        bg: "#F1F5F9",
        icon: "help-circle-outline",
      };
  }
};

const normalizeOrders = (raw: unknown): Order[] => {
  if (Array.isArray(raw)) return raw as Order[];

  if (raw && typeof raw === "object") {
    const data = raw as any;

    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.result)) return data.result;
  }

  return [];
};

const formatBookingDate = (value?: string) => {
  if (!value) return "Date not available";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

function FullScreenLoader() {
  return (
    <View className="flex-1 bg-slate-50 items-center justify-center px-6">
      <ActivityIndicator size="large" color="#2563EB" />
      <Text className="text-slate-400 text-xs font-bold mt-3">
        Syncing your bookings...
      </Text>
    </View>
  );
}

function EmptyState({
  filter,
  onBrowse,
}: {
  filter: FilterType;
  onBrowse: () => void;
}) {
  return (
    <View className="items-center justify-center py-24 px-8">
      <View className="w-20 h-20 rounded-[28px] bg-blue-50 items-center justify-center mb-5 border border-blue-100">
        <MaterialCommunityIcons
          name="calendar-blank-outline"
          size={38}
          color="#2563EB"
        />
      </View>

      <Text className="text-[#0B132B] text-lg font-black tracking-tight text-center">
        No bookings found
      </Text>

      <Text className="text-slate-400 text-xs font-semibold text-center mt-2 leading-5 max-w-xs">
        {filter === "All"
          ? "Book your first cleaning, repair or home maintenance service."
          : `No ${filter.toLowerCase()} bookings available right now.`}
      </Text>

      <Pressable
        onPress={onBrowse}
        className="mt-6 bg-[#0B132B] px-6 py-3.5 rounded-2xl active:opacity-90"
      >
        <Text className="text-white text-xs font-black uppercase tracking-widest">
          Browse Services
        </Text>
      </Pressable>
    </View>
  );
}

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const maxContentWidth = 1120;
  const horizontalPadding = isTablet ? 28 : 16;
  const cardGap = 16;
  const usableWidth = Math.min(width, maxContentWidth);

  const cardWidth = isTablet
    ? (usableWidth - horizontalPadding * 2 - cardGap) / 2
    : width - horizontalPadding * 2;

  const [filter, setFilter] = useState<FilterType>("All");
  const { isLoaded, isSignedIn } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["orderHistory"],
    queryFn: () => orderService.fetchOrderHistory(),
    enabled: isLoaded && !!isSignedIn,
  });

  const orders = useMemo(() => normalizeOrders(data), [data]);

  const counts = useMemo(() => {
    return {
      All: orders.length,
      Active: orders.filter(
        (order) => getStatusConfig(order.status).label === "Active"
      ).length,
      Completed: orders.filter(
        (order) => getStatusConfig(order.status).label === "Completed"
      ).length,
      Cancelled: orders.filter(
        (order) => getStatusConfig(order.status).label === "Cancelled"
      ).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "All") return orders;

    return orders.filter(
      (order) => getStatusConfig(order.status).label === filter
    );
  }, [orders, filter]);

  if (!isLoaded || isLoading) {
    return <FullScreenLoader />;
  }

  if (!isSignedIn) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        <MotiView
          from={{ opacity: 0, scale: 0.96, translateY: 18 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 280 }}
          className="w-full max-w-sm bg-white rounded-[32px] p-8 border border-slate-100 items-center"
          style={{
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 14 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <View className="w-16 h-16 rounded-3xl bg-[#0B132B] items-center justify-center mb-5">
            <Text className="text-white text-xl font-black">HX</Text>
          </View>

          <Text className="text-[#0B132B] text-xl font-black text-center tracking-tight">
            Sign in required
          </Text>

          <Text className="text-slate-400 text-xs font-semibold text-center mt-2 mb-7 leading-5">
            Sign in to view bookings, track service status and manage your home
            service history.
          </Text>

          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            className="w-full bg-[#0B132B] py-4 rounded-2xl flex-row items-center justify-center active:opacity-90"
          >
            <MaterialCommunityIcons name="login" size={17} color="white" />
            <Text className="text-white text-xs font-black uppercase tracking-widest ml-2">
              Continue Login
            </Text>
          </Pressable>
        </MotiView>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <View className="w-20 h-20 rounded-[28px] bg-red-50 items-center justify-center mb-5 border border-red-100">
          <Ionicons name="cloud-offline-outline" size={36} color="#EF4444" />
        </View>

        <Text className="text-[#0B132B] text-lg font-black tracking-tight">
          Failed to load bookings
        </Text>

        <Text className="text-slate-400 text-xs text-center mt-2 mb-6 leading-5 max-w-xs">
          {(error as Error).message ||
            "Something went wrong while syncing your bookings."}
        </Text>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => refetch()}
            className="bg-blue-600 px-5 py-3 rounded-2xl active:opacity-90"
          >
            <Text className="text-white text-xs font-black">Try Again</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/(tabs)")}
            className="bg-slate-100 px-5 py-3 rounded-2xl active:opacity-90"
          >
            <Text className="text-slate-700 text-xs font-black">Go Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

      <FlatList
        data={filteredOrders}
        key={isTablet ? "tablet-bookings" : "mobile-bookings"}
        numColumns={isTablet ? 2 : 1}
        keyExtractor={(item, index) => item._id || item.orderId || String(index)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#2563EB"
            colors={["#2563EB"]}
          />
        }
        columnWrapperStyle={isTablet ? { gap: cardGap } : undefined}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32,
          maxWidth: maxContentWidth,
          width: "100%",
          alignSelf: "center",
        }}
        ListHeaderComponent={
          <View>
            <View
              className="bg-[#0B132B] rounded-b-[36px] px-5"
              style={{
                paddingTop: insets.top + 18,
                paddingBottom: 28,
              }}
            >
              <View className="max-w-6xl w-full self-center">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-white text-2xl font-black tracking-tight">
                      My Bookings
                    </Text>
                    <Text className="text-slate-400 text-xs font-semibold mt-1">
                      Track active services and past repairs
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => refetch()}
                    className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 items-center justify-center active:opacity-80"
                  >
                    <Ionicons name="refresh" size={18} color="white" />
                  </Pressable>
                </View>

                <View className="flex-row mt-6 gap-3">
                  <View className="flex-1 bg-white/10 border border-white/10 rounded-2xl p-4">
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      Active
                    </Text>
                    <Text className="text-white text-2xl font-black mt-1">
                      {counts.Active}
                    </Text>
                  </View>

                  <View className="flex-1 bg-white/10 border border-white/10 rounded-2xl p-4">
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      Completed
                    </Text>
                    <Text className="text-white text-2xl font-black mt-1">
                      {counts.Completed}
                    </Text>
                  </View>

                  <View className="flex-1 bg-white/10 border border-white/10 rounded-2xl p-4">
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      Total
                    </Text>
                    <Text className="text-white text-2xl font-black mt-1">
                      {counts.All}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              className="px-4 -mt-5 mb-5"
              style={{ paddingHorizontal: horizontalPadding }}
            >
              <View
                className="bg-white rounded-2xl p-2 border border-slate-100 flex-row"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.06,
                  shadowRadius: 18,
                  elevation: 5,
                }}
              >
                {(["All", "Active", "Completed", "Cancelled"] as FilterType[]).map(
                  (tab) => {
                    const active = filter === tab;

                    return (
                      <Pressable
                        key={tab}
                        onPress={() => setFilter(tab)}
                        className={`flex-1 py-2.5 rounded-xl items-center ${
                          active ? "bg-[#0B132B]" : "bg-transparent"
                        }`}
                      >
                        <Text
                          className={`text-[11px] font-black ${
                            active ? "text-white" : "text-slate-500"
                          }`}
                        >
                          {tab}
                        </Text>

                        <Text
                          className={`text-[9px] font-bold mt-0.5 ${
                            active ? "text-white/70" : "text-slate-400"
                          }`}
                        >
                          {counts[tab]}
                        </Text>
                      </Pressable>
                    );
                  }
                )}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            filter={filter}
            onBrowse={() => router.push("/(tabs)/explore")}
          />
        }
        renderItem={({ item: order, index }) => {
          const primaryItem = order.items?.[0];
          const statusStyle = getStatusConfig(order.status);
          const phone = order.customerDetails?.phone;

          return (
            <MotiView
              from={{ opacity: 0, scale: 0.96, translateY: 18 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{
                delay: Math.min(index * 45, 300),
                type: "timing",
                duration: 260,
              }}
              style={{
                width: cardWidth,
                marginHorizontal: isTablet ? 0 : horizontalPadding,
                marginBottom: 16,
              }}
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/bookings/[id]",
                    params: {
                      id: order._id,
                      orderId: order.orderId || "",
                    },
                  })
                }
                className="bg-white rounded-[28px] p-5 border border-slate-100 active:opacity-95"
                style={{
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.06,
                  shadowRadius: 20,
                  elevation: 4,
                }}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-center flex-1 pr-3">
                    <View className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 mr-3">
                      <Image
                        source={{ uri: primaryItem?.image || fallbackImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>

                    <View className="flex-1">
                      <Text
                        className="text-[#0B132B] text-sm font-black tracking-tight"
                        numberOfLines={1}
                      >
                        {primaryItem?.name || "HouseXpertz Service"}
                      </Text>

                      <Text
                        className="text-slate-400 text-[11px] font-bold mt-1"
                        numberOfLines={1}
                      >
                        Order ID: {order.orderId || "N/A"}
                      </Text>

                      <View className="flex-row items-center mt-1.5">
                        <Ionicons name="star" size={11} color="#F59E0B" />
                        <Text className="text-slate-500 text-[10px] font-bold ml-1">
                          HouseXpertz verified
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    className="px-3 py-1.5 rounded-full flex-row items-center"
                    style={{ backgroundColor: statusStyle.bg }}
                  >
                    <MaterialCommunityIcons
                      name={statusStyle.icon as any}
                      size={12}
                      color={statusStyle.color}
                    />
                    <Text
                      className="text-[9px] font-black uppercase tracking-wider ml-1"
                      style={{ color: statusStyle.color }}
                    >
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>

                <View className="h-px bg-slate-100 my-4" />

                <View className="gap-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 pr-3">
                      <Ionicons
                        name="calendar-outline"
                        size={15}
                        color="#64748B"
                      />
                      <Text
                        className="text-slate-500 text-xs font-bold ml-2"
                        numberOfLines={1}
                      >
                        {formatBookingDate(order.bookingDate)}
                      </Text>
                    </View>

                    <Text className="text-[#0B132B] text-lg font-black">
                      ₹{Number(order.totalAmount || 0)}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color="#64748B"
                    />
                    <Text
                      className="text-slate-500 text-xs font-semibold ml-2 flex-1"
                      numberOfLines={1}
                    >
                      {order.customerDetails?.address ||
                        "Service location not available"}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={15} color="#64748B" />
                    <Text
                      className="text-slate-500 text-xs font-semibold ml-2 flex-1"
                      numberOfLines={1}
                    >
                      {order.assignedPartner || "Partner assignment pending"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3 mt-5">
                  <Pressable
                    disabled={!phone}
                    onPress={(event) => {
                      event.stopPropagation();
                      if (phone) Linking.openURL(`tel:${phone}`);
                    }}
                    className={`flex-1 border py-3 rounded-2xl flex-row items-center justify-center ${
                      phone
                        ? "bg-slate-50 border-slate-100 active:bg-slate-100"
                        : "bg-slate-100 border-slate-100 opacity-60"
                    }`}
                  >
                    <Ionicons name="call-outline" size={15} color="#334155" />
                    <Text className="text-slate-700 text-xs font-black ml-2">
                      Call
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={(event) => {
                      event.stopPropagation();
                      router.push({
                        pathname: "/bookings/[id]",
                        params: {
                          id: order._id,
                          orderId: order.orderId || "",
                        },
                      });
                    }}
                    className="flex-1 bg-[#0B132B] py-3 rounded-2xl flex-row items-center justify-center active:opacity-90"
                  >
                    <Text className="text-white text-xs font-black mr-2">
                      Details
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="white" />
                  </Pressable>
                </View>
              </Pressable>
            </MotiView>
          );
        }}
      />
    </View>
  );
}