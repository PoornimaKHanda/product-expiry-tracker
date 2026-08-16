import React from "react";
import {
  AppButton,
  HomeTabs,
  ProductContextMenu,
  ItemCard,
  SectionHeader,
} from "@/src/features/shared/components";
import { useHomeScreenController } from "@/src/features/shared/hooks/useHomeScreenController";
import { ensurePermission } from "@/src/hooks/usePermission";
import { strings } from "@/src/i18n";
import { CommonStyles } from "@/src/styles/common";
import { ModalStyles } from "@/src/styles/modals";
import { ScreenStyles } from "@/src/styles/screens";
import { Colors } from "@/src/theme/colors";
import { Typography } from "@/src/theme/typography";
import { formatDate } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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

  const { expiringSoon, warrantyEndingSoon, allProducts, galleryItems } =
    sections;

  const [selectedGalleryItem, setSelectedGalleryItem] = React.useState<
    (typeof galleryItems)[number] | null
  >(null);
  const [isFullScreenImageOpen, setIsFullScreenImageOpen] =
    React.useState(false);
  const [isSavingGallery, setIsSavingGallery] = React.useState(false);
  const [gallerySearch, setGallerySearch] = React.useState("");

  const filteredGalleryItems = React.useMemo(() => {
    const query = gallerySearch.trim().toLowerCase();
    if (!query) return galleryItems;

    return galleryItems.filter((item) =>
      item.productName.toLowerCase().includes(query),
    );
  }, [galleryItems, gallerySearch]);

  const handleSaveToGallery = React.useCallback(async () => {
    if (!selectedGalleryItem) return;

    const granted = await ensurePermission("mediaLibrary", {
      rationale: {
        title: "Photo library access",
        message:
          "Save this receipt or photo to your device gallery when you need a quick proof copy.",
      },
    });

    if (!granted) return;

    setIsSavingGallery(true);

    try {
      await MediaLibrary.saveToLibraryAsync(selectedGalleryItem.uri);
      Alert.alert("Saved", "The image was saved to your photo library.");
      setSelectedGalleryItem(null);
    } catch (error) {
      console.error("save-to-library failed", error);
      Alert.alert("Could not save image", "Please try again.");
    } finally {
      setIsSavingGallery(false);
    }
  }, [selectedGalleryItem]);

  const closeGalleryPreview = React.useCallback(() => {
    setSelectedGalleryItem(null);
    setIsFullScreenImageOpen(false);
  }, []);

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
        ) : activeTab === "all" ? (
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
        ) : (
          <>
            <SectionHeader title={strings.galleryTab} />
            <TextInput
              value={gallerySearch}
              onChangeText={setGallerySearch}
              placeholder="Search by product name"
              style={ScreenStyles.gallerySearch}
              placeholderTextColor={Colors.textSecondary}
            />
            {filteredGalleryItems.length === 0 ? (
              <Text style={ScreenStyles.emptyStateText}>
                {strings.galleryEmptyState}
              </Text>
            ) : (
              <View style={ScreenStyles.galleryGrid}>
                {filteredGalleryItems.map((item) => (
                  <TouchableOpacity
                    key={`${item.productId}-${item.uri}`}
                    activeOpacity={0.9}
                    style={ScreenStyles.galleryTile}
                    onPress={() => setSelectedGalleryItem(item)}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      style={ScreenStyles.galleryImage}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={ScreenStyles.bottomSpacer} />
          </>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedGalleryItem && !isFullScreenImageOpen}
        transparent
        animationType="fade"
        onRequestClose={closeGalleryPreview}
      >
        <View style={ModalStyles.overlay}>
          <View style={ModalStyles.card}>
            <View style={ScreenStyles.previewHeader}>
              <Text style={ModalStyles.title}>
                {strings.galleryPreviewTitle}
              </Text>
            </View>

            {selectedGalleryItem ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setIsFullScreenImageOpen(true)}
                >
                  <Image
                    source={{ uri: selectedGalleryItem.uri }}
                    style={ScreenStyles.previewImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={ScreenStyles.previewMeta}>
                  {selectedGalleryItem.productName} •{" "}
                  {selectedGalleryItem.category}
                </Text>
              </>
            ) : null}

            <View style={ModalStyles.actionsRow}>
              <TouchableOpacity
                onPress={handleSaveToGallery}
                style={ModalStyles.actionButton}
                disabled={isSavingGallery}
              >
                <Text style={ModalStyles.actionButtonText}>
                  {isSavingGallery ? "Saving..." : strings.saveToGallery}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isFullScreenImageOpen && !!selectedGalleryItem}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFullScreenImageOpen(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setIsFullScreenImageOpen(false)}
        >
          <View style={ScreenStyles.fullscreenBackdrop} />
        </TouchableWithoutFeedback>

        <View style={ScreenStyles.fullscreenContainer}>
          <ScrollView
            style={ScreenStyles.fullscreenScroll}
            contentContainerStyle={ScreenStyles.fullscreenContent}
            pinchGestureEnabled
            maximumZoomScale={3}
            minimumZoomScale={1}
            centerContent
            bouncesZoom
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: selectedGalleryItem?.uri }}
              style={ScreenStyles.fullscreenImage}
              resizeMode="contain"
            />
          </ScrollView>

          <View style={ScreenStyles.fullscreenFooter}>
            <TouchableOpacity
              onPress={handleSaveToGallery}
              style={ModalStyles.actionButton}
              disabled={isSavingGallery}
            >
              <Text style={ModalStyles.actionButtonText}>
                {isSavingGallery ? "Saving..." : strings.saveToGallery}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
