import { CategoryPicker, ReminderPicker } from "@/components/pickers";
import { AppButton, FormDatePicker, FormInput } from "@/components/ui";
import { useAddItemForm } from "../hooks/useAddItemForm";
import { CommonStyles } from "@/styles/common";
import { ScreenStyles } from "@/styles/screens";
import { Typography } from "@/theme/typography";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddItemScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    name,
    setName,
    category,
    setCategory,
    isExpiry,
    setIsExpiry,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reminderOption,
    setReminderOption,
    notes,
    setNotes,
    isEdit,
    onSave,
    onTestNotification,
  } = useAddItemForm(id);

  return (
    <View style={ScreenStyles.root}>
      <ScrollView style={CommonStyles.screen}>
        <Text style={Typography.title}>
          {isEdit ? "Edit Item" : "Add Item"}
        </Text>
        <Text style={ScreenStyles.modeBadge}>
          {isEdit ? "Edit mode" : "Add mode"}
        </Text>
        <Text style={[Typography.subtitle, ScreenStyles.screenSubtitle]}>
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
        <CategoryPicker value={category} onChange={setCategory} />

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
        <ReminderPicker value={reminderOption} onChange={setReminderOption} />
        <FormInput
          label="Notes (optional)"
          placeholder="Any extra info"
          value={notes}
          onChangeText={setNotes}
        />

        {__DEV__ ? (
          <AppButton
            kind="full"
            label="Send Test Notification"
            onPress={onTestNotification}
          />
        ) : null}
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
