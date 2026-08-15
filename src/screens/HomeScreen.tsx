import {
  AppButton,
  HomeTabs,
  ProductContextMenu,
  ItemCard,
  SectionHeader,
} from "@/src/components/ui";
import { useHomeScreenController } from "@/src/features/products/hooks/useHomeScreenController";
import { strings } from "@/src/i18n";
import { CommonStyles } from "@/src/styles/common";
import { ModalStyles } from "@/src/styles/modals";
import { ScreenStyles } from "@/src/styles/screens";
import { Colors } from "@/src/theme/colors";
import { Typography } from "@/src/theme/typography";
import { formatDate } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    activeTab,
    setActiveTab,
    showContextMenu,
    setShowContextMenu,
    showDeleteConfirm,
    setShowDeleteConfirm,
    openContextMenu,
    confirmDelete,
    onEdit,
    onDelete,
    onAddNew,
    sections,
  } = useHomeScreenController();

  const { expiringSoon, warrantyEndingSoon, allProducts } = sections;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={ScreenStyles.root}>
      <ScrollView style={CommonStyles.screen}>
        <Text style={Typography.title}>{strings.appTitle}</Text>
        <Text style={Typography.subtitle}>{strings.appSubtitle}</Text>

        <HomeTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "home" ? (
          <>
            <SectionHeader title={strings.sectionExpiringSoon} />
            {expiringSoon.length === 0 ? (
              <Text style={ScreenStyles.emptyStateText}>
                {strings.emptyExpiringSoon}
              </Text>
            ) : (
              expiringSoon.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  subtitle={item.category}
                  dateLabel={strings.expiresOn(formatDate(item.endDate))}
                  itemType={item.type}
                  hasAttachments={(item.attachments || []).length > 0}
                  onMenuPress={() => openContextMenu(item)}
                />
              ))
            )}

            <SectionHeader title={strings.sectionWarrantyEndingSoon} />
            {warrantyEndingSoon.length === 0 ? (
              <Text style={ScreenStyles.emptyStateText}>
                {strings.emptyWarrantyEndingSoon}
              </Text>
            ) : (
              warrantyEndingSoon.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  subtitle={item.category}
                  dateLabel={strings.warrantyEndsOn(formatDate(item.endDate))}
                  itemType={item.type}
                  hasAttachments={(item.attachments || []).length > 0}
                  onMenuPress={() => openContextMenu(item)}
                />
              ))
            )}

            <View style={ScreenStyles.bottomSpacer} />
          </>
        ) : (
          <>
            <SectionHeader title={strings.sectionAllItems} />
            {allProducts.length === 0 ? (
              <Text style={ScreenStyles.emptyStateText}>
                {strings.emptyAllItems}
              </Text>
            ) : (
              allProducts.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  subtitle={item.category}
                  dateLabel={
                    item.type === "expiry"
                      ? strings.expiresOn(formatDate(item.endDate))
                      : strings.warrantyEndsOn(formatDate(item.endDate))
                  }
                  itemType={item.type}
                  showTypeBadge
                  hasAttachments={(item.attachments || []).length > 0}
                  onMenuPress={() => openContextMenu(item)}
                />
              ))
            )}

            <View style={ScreenStyles.bottomSpacer} />
          </>
        )}
      </ScrollView>

      {activeTab === "home" ? (
        <View style={ScreenStyles.bottomActionBar}>
          <AppButton
            kind="full"
            label={strings.addProduct}
            onPress={onAddNew}
          />
        </View>
      ) : null}

      <ProductContextMenu
        visible={showContextMenu}
        onClose={() => setShowContextMenu(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={ModalStyles.overlay}>
          <View style={ModalStyles.card}>
            <View style={ModalStyles.deleteHeaderRow}>
              <Ionicons
                name="warning-outline"
                size={22}
                color={Colors.danger}
              />
              <Text style={[ModalStyles.title, ModalStyles.deleteTitle]}>
                {strings.deleteItem}
              </Text>
            </View>
            <Text style={[Typography.body, { marginBottom: 24 }]}>
              {strings.deleteItemConfirm}
            </Text>
            <View style={ModalStyles.actionsRow}>
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(false)}
                style={[
                  ModalStyles.actionButton,
                  ModalStyles.actionButtonSecondary,
                ]}
              >
                <Text style={ModalStyles.actionButtonText}>
                  {strings.cancelButton}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
                style={ModalStyles.actionButton}
              >
                <Text
                  style={[
                    ModalStyles.actionButtonText,
                    { color: Colors.danger },
                  ]}
                >
                  {strings.delete}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
