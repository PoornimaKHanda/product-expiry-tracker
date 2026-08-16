import React from "react";
import {
  AppButton,
  DeleteConfirmationModal,
  GalleryPreviewModal,
  GalleryTabSection,
  HomeTabs,
  ProductContextMenu,
  ProductListSection,
  ReadOnlyDetailModal,
} from "@/src/features/shared/components";
import { useHomeScreenController } from "@/src/features/shared/hooks/useHomeScreenController";
import {
  getDetailProductId,
  useReadOnlyItemDetailViewModel,
} from "@/src/features/shared/viewModels/useReadOnlyItemDetailViewModel";
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
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabType } from "@/src/features/shared/TabType";

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

  const {
    selectedDetail,
    selectedAttachment,
    openDetail,
    closeDetail,
    openAttachment,
    closeAttachment,
  } = useReadOnlyItemDetailViewModel();

  const { expiringSoon, warrantyEndingSoon, allProducts, galleryItems } =
    sections;

  const [selectedGalleryItem, setSelectedGalleryItem] = React.useState<
    (typeof galleryItems)[number] | null
  >(null);
  const [isFullScreenImageOpen, setIsFullScreenImageOpen] =
    React.useState(false);
  const [isSavingGallery, setIsSavingGallery] = React.useState(false);
  const [gallerySearch, setGallerySearch] = React.useState("");

  const handleSaveToGallery = React.useCallback(async () => {
    if (!selectedGalleryItem) return;

    const granted = await ensurePermission("mediaLibrary", {
      rationale: {
        title: strings.photoLibraryAccessTitle,
        message: strings.photoLibraryAccessMessage,
      },
    });

    if (!granted) return;

    setIsSavingGallery(true);

    try {
      await MediaLibrary.saveToLibraryAsync(selectedGalleryItem.uri);
      Alert.alert(strings.saved, strings.imageSavedToGalleryMessage);
      setSelectedGalleryItem(null);
    } catch (error) {
      console.error("save-to-library failed", error);
      Alert.alert(strings.imageSaveFailedTitle, strings.imageSaveFailedMessage);
    } finally {
      setIsSavingGallery(false);
    }
  }, [selectedGalleryItem]);

  const closeGalleryPreview = React.useCallback(() => {
    setSelectedGalleryItem(null);
    closeAttachment();
    setIsFullScreenImageOpen(false);
  }, [closeAttachment]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={ScreenStyles.root}>
      <ScrollView style={CommonStyles.screen}>
        <Text style={Typography.title}>{strings.appTitle}</Text>
        <Text style={Typography.subtitle}>{strings.appSubtitle}</Text>

        <HomeTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === TabType.HOME ? (
          <>
            <ProductListSection
              title={strings.sectionExpiringSoon}
              items={expiringSoon}
              emptyText={strings.emptyExpiringSoon}
              onOpenItem={openDetail}
              onOpenMenu={openContextMenu}
            />

            <ProductListSection
              title={strings.sectionWarrantyEndingSoon}
              items={warrantyEndingSoon}
              emptyText={strings.emptyWarrantyEndingSoon}
              onOpenItem={openDetail}
              onOpenMenu={openContextMenu}
            />

            <View style={ScreenStyles.bottomSpacer} />
          </>
        ) : activeTab === "all" ? (
          <>
            <ProductListSection
              title={strings.sectionAllItems}
              items={allProducts}
              emptyText={strings.emptyAllItems}
              showTypeBadge
              onOpenItem={openDetail}
              onOpenMenu={openContextMenu}
            />

            <View style={ScreenStyles.bottomSpacer} />
          </>
        ) : (
          <GalleryTabSection
            items={galleryItems}
            searchValue={gallerySearch}
            onSearchChange={setGallerySearch}
            onSelectItem={setSelectedGalleryItem}
          />
        )}
      </ScrollView>

      <ReadOnlyDetailModal
        visible={!!selectedDetail}
        item={selectedDetail}
        onClose={closeDetail}
        onPreviewAttachment={(detailItem, uri) => {
          const attachmentItem = {
            productId: getDetailProductId(detailItem),
            productName: detailItem.name,
            category: detailItem.category ?? "",
            uri,
          };

          openAttachment(detailItem, uri);
          setSelectedGalleryItem(attachmentItem);
        }}
      />

      <GalleryPreviewModal
        visible={!!selectedGalleryItem}
        item={selectedGalleryItem}
        isFullScreenImageOpen={isFullScreenImageOpen}
        isSavingGallery={isSavingGallery}
        onClose={closeGalleryPreview}
        onOpenFullScreen={() => setIsFullScreenImageOpen(true)}
        onCloseFullScreen={() => setIsFullScreenImageOpen(false)}
        onSave={handleSaveToGallery}
      />

      {activeTab === TabType.HOME ? (
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

      <DeleteConfirmationModal
        visible={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
}
