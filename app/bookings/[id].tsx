import { orderService } from "@/services/orderService";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useMemo } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THEME = "#0B132B";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300";

interface OrderItem {
  serviceId?: string;
  name?: string;
  price?: number;
  image?: string;
  _id?: string;
}

interface AssignedPartner {
  name?: string;
  phone?: string;
}

interface OrderDetail {
  _id?: string;
  orderId?: string;
  userId?: string;
  items?: OrderItem[];
  status?: string;
  totalAmount?: number;
  bookingDate?: string;
  serviceFee?: number;
  customerDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  assignedPartner?: AssignedPartner | string | null;
}

const normalizeOrder = (raw: unknown): OrderDetail | null => {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as any;

  if (data.order && typeof data.order === "object") return data.order;
  if (data.data && typeof data.data === "object") return data.data;
  if (data.result && typeof data.result === "object") return data.result;

  return data;
};

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

const formatFullDate = (value?: string) => {
  if (!value) return "Schedule not available";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
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

const getPartner = (partner: OrderDetail["assignedPartner"]) => {
  if (!partner) return null;
  if (typeof partner === "string") return { name: partner, phone: "" };
  return partner;
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start py-3">
      <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center mr-3">
        <Ionicons name={icon} size={16} color="#64748B" />
      </View>
      <View className="flex-1">
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
          {label}
        </Text>
        <Text className="text-[#0B132B] text-sm font-bold mt-1 leading-5">
          {value}
        </Text>
      </View>
    </View>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className="bg-white rounded-[28px] p-5 border border-slate-100"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 18,
        elevation: 3,
      }}
    >
      <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function OrderDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { isLoaded, isSignedIn } = useAuth();

  const isTablet = width >= 768;

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["orderDetail", id],
    queryFn: () => orderService.fetchOrderById(String(id)),
    enabled: isLoaded && !!isSignedIn && !!id,
  });

  const order = useMemo(() => normalizeOrder(data), [data]);
  const statusStyle = getStatusConfig(order?.status);
  const items = order?.items || [];
  const partner = getPartner(order?.assignedPartner);

  const totalAmount = Number(order?.totalAmount || 0);
  const serviceFee = Number(order?.serviceFee || 0);
  const subtotal = Math.max(totalAmount - serviceFee, 0);

  const handleCallCustomer = () => {
    const phone = order?.customerDetails?.phone;
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const handleCallPartner = () => {
    if (partner?.phone) Linking.openURL(`tel:${partner.phone}`);
  };

  const handleReorder = () => {
    router.push({
      pathname: "/(tabs)/cart",
      params: {
        reorder: "true",
        orderId: order?.orderId || "",
        id: order?._id || "",
      },
    });
  };

  if (!isLoaded || isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <StatusBar barStyle="light-content" backgroundColor={THEME} />
        <ActivityIndicator size="large" color={THEME} />
        <Text className="text-slate-400 text-xs font-bold mt-3">
          Loading booking details...
        </Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-[#0B132B] font-black text-lg">
          Sign in required
        </Text>
        <Text className="text-slate-400 text-xs font-semibold text-center mt-2 mb-5">
          Please login to view your booking details.
        </Text>
        <Pressable
          onPress={() => router.replace("/(auth)/login")}
          className="bg-[#0B132B] px-6 py-3.5 rounded-2xl"
        >
          <Text className="text-white text-xs font-black">Login</Text>
        </Pressable>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center px-6">
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View className="w-20 h-20 rounded-[28px] bg-red-50 items-center justify-center mb-5">
          <Ionicons name="alert-circle-outline" size={38} color="#EF4444" />
        </View>
        <Text className="text-[#0B132B] text-lg font-black">
          Failed to load booking
        </Text>
        <Text className="text-slate-400 text-xs text-center mt-2 mb-6 leading-5">
          {(error as Error)?.message || "Booking details are unavailable."}
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-[#0B132B] px-6 py-3 rounded-2xl"
        >
          <Text className="text-white text-xs font-black">
            {isRefetching ? "Retrying..." : "Try Again"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor={THEME} />

      <View
        className="bg-[#0B132B] px-5 rounded-b-[34px]"
        style={{ paddingTop: insets.top + 14, paddingBottom: 22 }}
      >
        <View className="w-full max-w-6xl self-center">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="w-11 h-11 bg-white/10 rounded-2xl items-center justify-center border border-white/10 active:opacity-80"
            >
              <Ionicons name="chevron-back" size={22} color="white" />
            </Pressable>

            <View className="flex-1 mx-4">
              <Text className="text-white text-lg font-black tracking-tight text-center">
                Booking Details
              </Text>
              <Text
                className="text-slate-400 text-[11px] font-bold mt-1 text-center"
                numberOfLines={1}
              >
                Order ID: {order.orderId || "N/A"}
              </Text>
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
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 28 : 16,
          paddingTop: 18,
          paddingBottom: insets.bottom + 112,
          maxWidth: 1120,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 220 }}
          className={isTablet ? "flex-row gap-5" : "gap-5"}
        >
          <View className={isTablet ? "flex-1 gap-5" : "gap-5"}>
            <Card title="Services booked">
              {items.length === 0 ? (
                <Text className="text-slate-400 text-xs font-semibold">
                  No services found in this booking.
                </Text>
              ) : (
                items.map((item, index) => (
                  <View
                    key={item._id || `${item.name}-${index}`}
                    className={`flex-row items-center ${
                      index !== items.length - 1
                        ? "pb-4 mb-4 border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <Image
                      source={{ uri: item.image || FALLBACK_IMAGE }}
                      className="w-14 h-14 rounded-2xl bg-slate-100 mr-3"
                      resizeMode="cover"
                    />

                    <View className="flex-1 pr-3">
                      <Text
                        className="text-[#0B132B] text-sm font-black"
                        numberOfLines={2}
                      >
                        {item.name || "HouseXpertz Service"}
                      </Text>
                      <Text className="text-slate-400 text-[11px] font-bold mt-1">
                        Verified home service
                      </Text>
                    </View>

                    <Text className="text-[#0B132B] text-sm font-black">
                      ₹{Number(item.price || 0)}
                    </Text>
                  </View>
                ))
              )}
            </Card>

            <Card title="Payment summary">
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-slate-500 text-xs font-semibold">
                    Service subtotal
                  </Text>
                  <Text className="text-slate-700 text-xs font-black">
                    ₹{subtotal}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-slate-500 text-xs font-semibold">
                    Platform fee
                  </Text>
                  <Text className="text-slate-700 text-xs font-black">
                    ₹{serviceFee}
                  </Text>
                </View>

                <View className="h-px bg-slate-100 my-1" />

                <View className="flex-row justify-between items-center">
                  <Text className="text-[#0B132B] text-sm font-black">
                    Total amount
                  </Text>
                  <Text className="text-[#0B132B] text-xl font-black">
                    ₹{totalAmount}
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          <View className={isTablet ? "flex-1 gap-5" : "gap-5"}>
            <Card title="Schedule">
              <InfoRow
                icon="calendar-outline"
                label="Booking slot"
                value={formatFullDate(order.bookingDate)}
              />
            </Card>

            <Card title="Assigned professional">
              {partner ? (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 pr-3">
                    <View className="w-11 h-11 rounded-2xl bg-slate-100 items-center justify-center mr-3">
                      <Ionicons name="person-outline" size={18} color="#475569" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[#0B132B] text-sm font-black"
                        numberOfLines={1}
                      >
                        {partner.name || "Assigned Partner"}
                      </Text>
                      <Text className="text-slate-400 text-[11px] font-bold mt-1">
                        HouseXpertz Professional
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    disabled={!partner.phone}
                    onPress={handleCallPartner}
                    className={`px-4 py-2.5 rounded-2xl flex-row items-center ${
                      partner.phone ? "bg-[#0B132B]" : "bg-slate-200"
                    }`}
                  >
                    <Ionicons
                      name="call-outline"
                      size={14}
                      color={partner.phone ? "white" : "#94A3B8"}
                    />
                    <Text
                      className={`text-xs font-black ml-1.5 ${
                        partner.phone ? "text-white" : "text-slate-400"
                      }`}
                    >
                      Call
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-2xl bg-slate-100 items-center justify-center mr-3">
                    <MaterialCommunityIcons
                      name="account-clock-outline"
                      size={21}
                      color="#94A3B8"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0B132B] text-sm font-black">
                      Assignment pending
                    </Text>
                    <Text className="text-slate-400 text-xs font-semibold mt-1 leading-5">
                      A professional will be assigned before your service slot.
                    </Text>
                  </View>
                </View>
              )}
            </Card>

            <Card title="Service location">
              <InfoRow
                icon="person-outline"
                label="Customer"
                value={order.customerDetails?.name || "Customer"}
              />
              <InfoRow
                icon="location-outline"
                label="Address"
                value={
                  order.customerDetails?.address ||
                  "Service location not available"
                }
              />
              <InfoRow
                icon="call-outline"
                label="Phone"
                value={order.customerDetails?.phone || "Phone not available"}
              />
            </Card>
          </View>
        </MotiView>
      </ScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 bg-white border-t border-slate-100 px-5"
        style={{
          paddingTop: 12,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 16,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.08,
          shadowRadius: 18,
          elevation: 12,
        }}
      >
        <View className="max-w-6xl w-full self-center flex-row items-center gap-3">
          <Pressable
            disabled={!order.customerDetails?.phone}
            onPress={handleCallCustomer}
            className={`h-14 px-4 rounded-2xl items-center justify-center border ${
              order.customerDetails?.phone
                ? "bg-slate-50 border-slate-100"
                : "bg-slate-100 border-slate-100 opacity-60"
            }`}
          >
            <Ionicons name="call-outline" size={20} color="#0B132B" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Total
            </Text>
            <Text className="text-[#0B132B] text-2xl font-black">
              ₹{totalAmount}
            </Text>
          </View>

          <Pressable
            onPress={handleReorder}
            className="h-14 px-6 rounded-2xl bg-[#0B132B] flex-row items-center justify-center active:opacity-90"
          >
            <Text className="text-white text-sm font-black mr-2">Reorder</Text>
            <Ionicons name="cart-outline" size={18} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}