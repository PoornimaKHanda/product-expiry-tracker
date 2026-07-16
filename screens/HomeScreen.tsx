import {
  AppButton,
  HomeTabs,
  ItemActionSheet,
  ItemCard,
  SectionHeader,
} from "@/components/ui";
import { useProductsContext } from "@/contexts/ProductContext";
import { strings } from "@/i18n";
import { CommonStyles } from "@/styles/common";
import { ModalStyles } from "@/styles/modals";
import { ScreenStyles } from "@/styles/screens";
import { Typography } from "@/theme/typography";
import { formatDate } from "@/utils/date";
import { deleteProductById } from "@/utils/db";
import { cancelItemNotifications } from "@/utils/notifications";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  id: number;
  name: string;
  category: string;
  end_date: string;
  type: "expiry" | "warranty";
};

export default function HomeScreen() {
  const router = useRouter();
  const { expiringSoon, warrantyEndingSoon, allProducts, refreshProducts } =
    useProductsContext();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "all">("home");
  const [showSheet, setShowSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const openActions = (item: Product) => {
    setSelectedItem(item);
    setShowSheet(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    setShowDeleteConfirm(false);
    await cancelItemNotifications(selectedItem.id);
    await deleteProductById(selectedItem.id);
    setSelectedItem(null);
    refreshProducts();
  };

  useFocusEffect(
    useCallback(() => {
      refreshProducts();
    }, [refreshProducts]),
  );

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
                  dateLabel={strings.expiresOn(formatDate(item.end_date))}
                  itemType={item.type}
                  onMenuPress={() => openActions(item)}
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
                  dateLabel={strings.warrantyEndsOn(formatDate(item.end_date))}
                  itemType={item.type}
                  onMenuPress={() => openActions(item)}
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
                      ? strings.expiresOn(formatDate(item.end_date))
                      : strings.warrantyEndsOn(formatDate(item.end_date))
                  }
                  itemType={item.type}
                  showTypeBadge
                  onMenuPress={() => openActions(item)}
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
            onPress={() => router.push("/add-item")}
          />
        </View>
      ) : null}

      <ItemActionSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onEdit={() => {
          if (!selectedItem) return;
          setShowSheet(false);
          router.push({
            pathname: "/add-item",
            params: { id: selectedItem.id },
          });
        }}
        onDelete={() => {
          if (!selectedItem) return;
          setShowSheet(false);
          setShowDeleteConfirm(true);
        }}
      />

      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={ModalStyles.overlay}>
          <View style={ModalStyles.card}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <Ionicons name="warning-outline" size={22} color="#E53935" />
              <Text
                style={[ModalStyles.title, { marginLeft: 10, marginBottom: 0 }]}
              >
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
                  style={[ModalStyles.actionButtonText, { color: "#E53935" }]}
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
