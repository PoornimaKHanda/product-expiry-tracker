import {
  CategoryPicker,
  FormDatePicker,
  FormInput,
  ReminderPicker,
  WarrantyDurationPicker,
} from "@/src/features/products/components";
import { ProductType } from "@/src/features/products/types";
import {
  AppAlertModal,
  AppButton,
  AttachmentSection,
} from "@/src/features/shared/components";
import { useAddItemScreenController } from "@/src/features/products/hooks/useAddItemScreenController";
import { strings } from "@/src/i18n";
import { CommonStyles } from "@/src/styles/common";
import { ScreenStyles } from "@/src/styles/screens";
import { Typography } from "@/src/theme/typography";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddItemScreen() {
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
    attachments,
    addAttachment,
    removeAttachment,
    isAttachmentBusy,
    isEdit,
    onSave,
    formError,
    dismissFormError,
    onTestNotification,
    selectedDuration,
    onWarrantyDurationSelect,
  } = useAddItemScreenController();

  return (
    <KeyboardAvoidingView
      style={ScreenStyles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40} // tweak if needed
    >
      <ScrollView
        style={CommonStyles.screen}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={ScreenStyles.listContent}
      >
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
          required
        />
        <CategoryPicker value={category} onChange={setCategory} />

        <AppButton
          kind="radio"
          options={[
            { label: strings.expiry, value: ProductType.EXPIRY },
            { label: strings.warranty, value: ProductType.WARRANTY },
          ]}
          selected={isExpiry ? ProductType.EXPIRY : ProductType.WARRANTY}
          onSelect={(val) => setIsExpiry(val === ProductType.EXPIRY)}
        />

        <FormDatePicker
          label={isExpiry ? strings.openedPurchaseDate : strings.purchaseDate}
          date={startDate}
          onChange={(d) => setStartDate(d.toISOString().split("T")[0])}
          required
        />
        {!isExpiry && (
          <WarrantyDurationPicker
            onSelect={onWarrantyDurationSelect}
            selected={selectedDuration}
          />
        )}
        <FormDatePicker
          label={isExpiry ? strings.expiryDate : strings.warrantyEndDate}
          date={endDate}
          onChange={(d) => setEndDate(d.toISOString().split("T")[0])}
          required
        />
        <ReminderPicker value={reminderOption} onChange={setReminderOption} />
        <AttachmentSection
          attachments={attachments}
          onAdd={addAttachment}
          onRemove={removeAttachment}
          isBusy={isAttachmentBusy}
        />
        <FormInput
          label={strings.notesLabel}
          placeholder={strings.notesPlaceholder}
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={1000}
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
      <AppAlertModal
        visible={Boolean(formError)}
        title={strings.formValidationTitle}
        message={formError ?? ""}
        onClose={dismissFormError}
      />
    </KeyboardAvoidingView>
  );
}
