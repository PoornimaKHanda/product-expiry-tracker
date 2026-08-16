import { AttachmentGalleryItem } from "@/src/features/attachments/utils/buildAttachmentGallery";
import { strings } from "@/src/i18n";
import { ModalStyles } from "@/src/styles/modals";
import { ScreenStyles } from "@/src/styles/screens";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  item: AttachmentGalleryItem | null;
  isFullScreenImageOpen: boolean;
  isSavingGallery: boolean;
  onClose: () => void;
  onOpenFullScreen: () => void;
  onCloseFullScreen: () => void;
  onSave: () => void;
};

export function GalleryPreviewModal({
  visible,
  item,
  isFullScreenImageOpen,
  isSavingGallery,
  onClose,
  onOpenFullScreen,
  onCloseFullScreen,
  onSave,
}: Props) {
  return (
    <>
      <Modal
        visible={visible && !!item && !isFullScreenImageOpen}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={ModalStyles.overlay}>
          <View style={ModalStyles.card}>
            <View style={ScreenStyles.previewHeader}>
              <Text style={ModalStyles.title}>
                {strings.galleryPreviewTitle}
              </Text>
            </View>

            {item ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onOpenFullScreen}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={ScreenStyles.previewImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={ScreenStyles.previewMeta}>
                  {item.productName} • {item.category}
                </Text>
              </>
            ) : null}

            <View style={ModalStyles.actionsRow}>
              <TouchableOpacity
                onPress={onSave}
                style={ModalStyles.actionButton}
                disabled={isSavingGallery}
              >
                <Text style={ModalStyles.actionButtonText}>
                  {isSavingGallery ? strings.saving : strings.saveToGallery}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={visible && !!item && isFullScreenImageOpen}
        transparent
        animationType="fade"
        onRequestClose={onCloseFullScreen}
      >
        <TouchableWithoutFeedback onPress={onCloseFullScreen}>
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
              source={{ uri: item?.uri }}
              style={ScreenStyles.fullscreenImage}
              resizeMode="contain"
            />
          </ScrollView>

          <View style={ScreenStyles.fullscreenFooter}>
            <TouchableOpacity
              onPress={onSave}
              style={ModalStyles.actionButton}
              disabled={isSavingGallery}
            >
              <Text style={ModalStyles.actionButtonText}>
                {isSavingGallery ? strings.saving : strings.saveToGallery}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
