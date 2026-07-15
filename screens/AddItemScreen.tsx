import { CategoryPicker, ReminderPicker } from "@/components/pickers";
import { AppButton, FormDatePicker, FormInput } from "@/components/ui";
import { strings } from "@/i18n";
import { CommonStyles } from "@/styles/common";
import { ScreenStyles } from "@/styles/screens";
import { Typography } from "@/theme/typography";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddItemForm } from "../hooks/useAddItemForm";

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
          {isEdit ? strings.editItem : strings.addItem}
        </Text>
        <Text style={ScreenStyles.modeBadge}>
          {isEdit ? strings.editMode : strings.addMode}
        </Text>
        <Text style={[Typography.subtitle, ScreenStyles.screenSubtitle]}>
          {isEdit
            ? strings.updateProductDetails
            : strings.trackProductExpiryOrWarranty}
        </Text>

        <FormInput
          label={strings.productNameLabel}
          placeholder={strings.productNamePlaceholder}
          value={name}
          onChangeText={setName}
        />
        <CategoryPicker value={category} onChange={setCategory} />

        <AppButton
          kind="radio"
          options={[
            { label: strings.expiry, value: "expiry" },
            { label: strings.warranty, value: "warranty" },
          ]}
          selected={isExpiry ? "expiry" : "warranty"}
          onSelect={(val) => setIsExpiry(val === "expiry")}
        />

        <FormDatePicker
          label={isExpiry ? strings.openedPurchaseDate : strings.purchaseDate}
          date={startDate}
          onChange={(d) => setStartDate(d.toISOString().split("T")[0])}
        />
        <FormDatePicker
          label={isExpiry ? strings.expiryDate : strings.warrantyEndDate}
          date={endDate}
          onChange={(d) => setEndDate(d.toISOString().split("T")[0])}
        />
        <ReminderPicker value={reminderOption} onChange={setReminderOption} />
        <FormInput
          label={strings.notesLabel}
          placeholder={strings.notesPlaceholder}
          value={notes}
          onChangeText={setNotes}
        />

        {__DEV__ ? (
          <AppButton
            kind="full"
            label={strings.sendTestNotification}
            onPress={onTestNotification}
          />
        ) : null}
      </ScrollView>

      <SafeAreaView edges={["bottom"]}>
        <AppButton
          kind="full"
          label={isEdit ? strings.update : strings.save}
          onPress={onSave}
        />
      </SafeAreaView>
    </View>
  );
}
