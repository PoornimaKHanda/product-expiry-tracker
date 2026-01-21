import { RadioGroup } from "@/components/RadioGroup";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { FloatingButton } from "../components/FloatingButton";
import { FormDatePicker } from "../components/FormDatePicker";
import { FormInput } from "../components/FormInput";
import { CommonStyles } from "../styles/common";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isExpiry, setIsExpiry] = useState(true);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [notes, setNotes] = useState("");

  const onSave = () => {
    // Placeholder: actual storage comes later
    console.log({ name, category, isExpiry, startDate, endDate, notes });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={CommonStyles.screen}>
        <Text style={Typography.title}>Add Item</Text>

        <Text style={{ ...Typography.subtitle, marginBottom: Spacing.md }}>
          Track product expiry or warranty
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
        <RadioGroup
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
          onPress={() => {}}
        />

        <FormDatePicker
          label={isExpiry ? "Expiry Date" : "Warranty End Date"}
          date={endDate}
          onPress={() => {}}
        />

        <FormInput
          label="Notes (optional)"
          placeholder="Any extra info"
          value={notes}
          onChangeText={setNotes}
        />
      </ScrollView>

      <FloatingButton onPress={onSave} />
    </View>
  );
}
