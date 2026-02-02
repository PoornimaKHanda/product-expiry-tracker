import { AppButton } from "@/components/AppButton";
import { fetchProductById, insertProduct, updateProduct } from "@/utils/db";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormDatePicker } from "../components/FormDatePicker";
import { FormInput } from "../components/FormInput";
import { CommonStyles } from "../styles/common";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

export default function AddItemScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isExpiry, setIsExpiry] = useState(true);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [notes, setNotes] = useState("");

  // -------------------------
  // Prefill if editing
  // -------------------------
  useEffect(() => {
    if (isEdit && id) {
      const product = fetchProductById(Number(id));

      if (!product) {
        Alert.alert("Item not found");
        router.back();
        return;
      }

      setName(product.name);
      setCategory(product.category || "");
      setIsExpiry(product.type === "expiry");
      setStartDate(product.start_date);
      setEndDate(product.end_date);
      setNotes(product.notes || "");
    }
  }, [id, isEdit]);

  // -------------------------
  // Save
  // -------------------------
  const onSave = () => {
    if (!name || !startDate || !endDate) {
      Alert.alert("Please fill required fields");
      return;
    }

    try {
      if (isEdit && id) {
        updateProduct(
          Number(id),
          name,
          category,
          isExpiry ? "expiry" : "warranty",
          startDate,
          endDate,
          notes,
        );
      } else {
        insertProduct(
          name,
          category,
          isExpiry ? "expiry" : "warranty",
          startDate,
          endDate,
          notes,
        );
      }

      router.back();
    } catch (e) {
      Alert.alert("Error saving item");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={CommonStyles.screen}>
        <Text style={Typography.title}>
          {isEdit ? "Edit Item" : "Add Item"}
        </Text>

        <Text
          style={{
            color: "#6b7280",
            fontSize: 12,
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          {isEdit ? "Edit mode" : "Add mode"}
        </Text>

        <Text style={{ ...Typography.subtitle, marginBottom: Spacing.md }}>
          {isEdit
            ? "Update product details"
            : "Track product expiry or warranty"}
        </Text>

        <FormInput
          label="Product Name"
          placeholder="Enter product name"
          value={name}
          onChangeText={setName}
        />

        <FormInput
          label="Category"
          placeholder="Makeup, Skincare, Electronics..."
          value={category}
          onChangeText={setCategory}
        />

        {/* Expiry / Warranty toggle */}
        <AppButton
          kind="radio"
          options={[
            { label: "Expiry", value: "expiry" },
            { label: "Warranty", value: "warranty" },
          ]}
          selected={isExpiry ? "expiry" : "warranty"}
          onSelect={(val) => setIsExpiry(val === "expiry")}
        />

        <FormDatePicker
          label={isExpiry ? "Opened / Purchase Date" : "Purchase Date"}
          date={startDate}
          onChange={(d) => setStartDate(d.toISOString().split("T")[0])}
        />

        <FormDatePicker
          label={isExpiry ? "Expiry Date" : "Warranty End Date"}
          date={endDate}
          onChange={(d) => setEndDate(d.toISOString().split("T")[0])}
        />

        <FormInput
          label="Notes (optional)"
          placeholder="Any extra info"
          value={notes}
          onChangeText={setNotes}
        />
      </ScrollView>

      <SafeAreaView edges={["bottom"]}>
        <AppButton
          kind="full"
          label={isEdit ? "Update" : "Save"}
          onPress={onSave}
        />
      </SafeAreaView>
    </View>
  );
}
