import { AddressPayload } from "@/services/address.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AddressType = "Home" | "Office" | "Other";

export interface EditableAddress {
  id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface EditAddressDialogProps {
  visible: boolean;
  address: EditableAddress | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (addressId: string, payload: AddressPayload) => void;
}

const THEME = "#0B132B";

export default function EditAddressDialog({
  visible,
  address,
  isSaving = false,
  onClose,
  onSubmit,
}: EditAddressDialogProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  const isTablet = width >= 768;
  const modalWidth = isTablet ? Math.min(width * 0.72, 640) : width;

  const [label, setLabel] = useState<AddressType>("Home");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (!address) return;

    const nextLabel =
      address.label === "Office" || address.label === "Work"
        ? "Office"
        : address.label === "Home"
        ? "Home"
        : "Other";

    setLabel(nextLabel);
    setFullName(address.fullName || "");
    setPhoneNumber(address.phoneNumber || "");
    setAddressLine(address.addressLine || "");
    setCity(address.city || "");
    setStateName(address.state || "");
    setPincode(address.pincode || "");
    setIsDefault(!!address.isDefault);
  }, [address]);

  const phoneClean = phoneNumber.replace(/\D/g, "");
  const pincodeClean = pincode.replace(/\D/g, "");

  const validation = useMemo(() => {
    if (!fullName.trim()) return "Full name is required";
    if (phoneClean.length !== 10) return "Enter a valid 10 digit phone number";
    if (!addressLine.trim()) return "Address is required";
    if (pincodeClean.length !== 6) return "Enter a valid 6 digit pincode";
    return "";
  }, [fullName, phoneClean, addressLine, pincodeClean]);

  const isValid = !validation;

  const closeSafely = () => {
    if (isSaving) return;
    Keyboard.dismiss();
    onClose();
  };

  const handleSubmit = () => {
    if (!address || !isValid || isSaving) return;

    Keyboard.dismiss();

    onSubmit(address.id, {
      label,
      fullName: fullName.trim(),
      phoneNumber: phoneClean,
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincodeClean,
      isDefault,
    });
  };

  const focusScroll = (offset: number) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: offset, animated: true });
    }, 160);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={closeSafely}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 22}
        className="flex-1 bg-black/50"
      >
        <Pressable className="flex-1" onPress={closeSafely} />

        <View className={isTablet ? "items-center px-6 pb-6" : ""}>
          <View
            className={`bg-white overflow-hidden ${
              isTablet ? "rounded-[32px]" : "rounded-t-[32px]"
            }`}
            style={{
              width: modalWidth,
              maxHeight: height * 0.9,
              paddingBottom: Math.max(insets.bottom, 12),
            }}
          >
            <View className="px-5 pt-5 pb-4 border-b border-slate-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-[#0B132B] text-xl font-black">
                    Edit Address
                  </Text>
                  <Text className="text-slate-400 text-xs font-semibold mt-1">
                    Update your saved service location
                  </Text>
                </View>

                <Pressable
                  onPress={closeSafely}
                  disabled={isSaving}
                  className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center disabled:opacity-50"
                >
                  <Ionicons name="close" size={20} color={THEME} />
                </Pressable>
              </View>
            </View>

            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 18,
                paddingBottom: 18,
              }}
            >
              <Text className="text-slate-700 text-xs font-black mb-2">
                Address Type
              </Text>

              <View className="flex-row gap-2 mb-4">
                {(["Home", "Office", "Other"] as AddressType[]).map((item) => {
                  const active = label === item;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setLabel(item)}
                      disabled={isSaving}
                      className={`flex-1 py-3 rounded-2xl items-center border ${
                        active
                          ? "bg-[#0B132B] border-[#0B132B]"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-black ${
                          active ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <FieldLabel label="Full Name" />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => focusScroll(40)}
                placeholder="Customer name"
                placeholderTextColor="#94A3B8"
                editable={!isSaving}
                returnKeyType="next"
                className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold mb-4"
              />

              <FieldLabel label="Phone Number" />
              <TextInput
                value={phoneNumber}
                onChangeText={(value) => setPhoneNumber(value.replace(/\D/g, ""))}
                onFocus={() => focusScroll(120)}
                placeholder="10 digit phone number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                editable={!isSaving}
                className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold mb-4"
              />

              <FieldLabel label="Address" />
              <TextInput
                value={addressLine}
                onChangeText={setAddressLine}
                onFocus={() => focusScroll(210)}
                placeholder="Flat, street, landmark"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                editable={!isSaving}
                className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold min-h-[112px] mb-4"
              />

              <View className={isTablet ? "flex-row gap-3" : "gap-0"}>
                <View className="flex-1">
                  <FieldLabel label="City" />
                  <TextInput
                    value={city}
                    onChangeText={setCity}
                    onFocus={() => focusScroll(330)}
                    placeholder="City"
                    placeholderTextColor="#94A3B8"
                    editable={!isSaving}
                    className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold mb-4"
                  />
                </View>

                <View className="flex-1">
                  <FieldLabel label="State" />
                  <TextInput
                    value={stateName}
                    onChangeText={setStateName}
                    onFocus={() => focusScroll(410)}
                    placeholder="State"
                    placeholderTextColor="#94A3B8"
                    editable={!isSaving}
                    className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold mb-4"
                  />
                </View>
              </View>

              <FieldLabel label="Pincode" />
              <TextInput
                value={pincode}
                onChangeText={(value) => setPincode(value.replace(/\D/g, ""))}
                onFocus={() => focusScroll(500)}
                placeholder="751022"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                editable={!isSaving}
                className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold mb-4"
              />

              <Pressable
                onPress={() => setIsDefault((prev) => !prev)}
                disabled={isSaving}
                className="flex-row items-center mb-4"
              >
                <View
                  className={`w-5 h-5 rounded-md border items-center justify-center ${
                    isDefault
                      ? "bg-[#0B132B] border-[#0B132B]"
                      : "bg-white border-slate-300"
                  }`}
                >
                  {isDefault && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-slate-600 text-xs font-bold ml-2">
                  Set as default address
                </Text>
              </Pressable>

              {!!validation && (
                <View className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4">
                  <Text className="text-amber-700 text-xs font-bold">
                    {validation}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={handleSubmit}
                disabled={!isValid || isSaving}
                className={`py-4 rounded-2xl items-center flex-row justify-center ${
                  isValid && !isSaving ? "bg-[#0B132B]" : "bg-slate-200"
                }`}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text
                      className={`text-xs font-black uppercase tracking-widest ${
                        isValid ? "text-white" : "text-slate-400"
                      }`}
                    >
                      Update Address
                    </Text>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={17}
                      color={isValid ? "white" : "#94A3B8"}
                      style={{ marginLeft: 8 }}
                    />
                  </>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FieldLabel({ label }: { label: string }) {
  return (
    <Text className="text-slate-700 text-xs font-black mb-2">{label}</Text>
  );
}