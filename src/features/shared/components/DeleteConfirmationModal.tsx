import { strings } from "@/src/i18n";
import { ModalStyles } from "@/src/styles/modals";
import { Colors } from "@/src/theme/colors";
import { Typography } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationModal({
  visible,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={ModalStyles.overlay}>
        <View style={ModalStyles.card}>
          <View style={ModalStyles.deleteHeaderRow}>
            <Ionicons name="warning-outline" size={22} color={Colors.danger} />
            <Text style={[ModalStyles.title, ModalStyles.deleteTitle]}>
              {strings.deleteItem}
            </Text>
          </View>
          <Text style={[Typography.body, { marginBottom: 24 }]}>
            {strings.deleteItemConfirm}
          </Text>
          <View style={ModalStyles.actionsRow}>
            <TouchableOpacity
              onPress={onCancel}
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
              onPress={onConfirm}
              style={ModalStyles.actionButton}
            >
              <Text
                style={[ModalStyles.actionButtonText, { color: Colors.danger }]}
              >
                {strings.delete}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
