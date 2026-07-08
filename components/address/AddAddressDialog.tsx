import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

type AddressType = "Home" | "Work" | "Other";

export interface AddressFormPayload {
  type: AddressType;
  name: string;
  details: string;
  isDefault: boolean;
}

interface AddAddressDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormPayload) => void;
}

export default function AddAddressDialog({
  visible,
  onClose,
  onSubmit,
}: AddAddressDialogProps) {
  const [type, setType] = useState<AddressType>("Home");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !details.trim()) return;

    onSubmit({
      type,
      name: name.trim(),
      details: details.trim(),
      isDefault,
    });

    setType("Home");
    setName("");
    setDetails("");
    setIsDefault(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-black/50 justify-end"
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-white rounded-t-[32px] px-5 pt-5 pb-8">
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-[#0B132B] text-xl font-black">
                Add Address
              </Text>
              <Text className="text-slate-400 text-xs font-semibold mt-1">
                Save a service location for faster booking
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#0B132B" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-slate-700 text-xs font-black mb-2">
              Address Type
            </Text>

            <View className="flex-row gap-2 mb-4">
              {(["Home", "Work", "Other"] as AddressType[]).map((item) => {
                const active = type === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setType(item)}
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

            <Text className="text-slate-700 text-xs font-black mb-2">
              Label
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Example: Primary Residence"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold mb-4"
            />

            <Text className="text-slate-700 text-xs font-black mb-2">
              Full Address
            </Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder="Flat, street, landmark, city, pincode"
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[#0B132B] text-sm font-semibold min-h-[110px] mb-4"
            />

            <Pressable
              onPress={() => setIsDefault((prev) => !prev)}
              className="flex-row items-center mb-6"
            >
              <View
                className={`w-5 h-5 rounded-md border items-center justify-center ${
                  isDefault
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-slate-300"
                }`}
              >
                {isDefault && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text className="text-slate-600 text-xs font-bold ml-2">
                Set as default address
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={!name.trim() || !details.trim()}
              className={`py-4 rounded-2xl items-center ${
                name.trim() && details.trim()
                  ? "bg-blue-600 active:bg-blue-700"
                  : "bg-slate-200"
              }`}
            >
              <Text className="text-white text-xs font-black uppercase tracking-widest">
                Save Address
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}