import { Modal, Pressable, Text, View } from "react-native";
import { strings } from "@/src/i18n";
import { ModalStyles } from "@/src/styles/modals";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export function AppAlertModal({ visible, title, message, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={ModalStyles.overlay}>
        <View style={ModalStyles.card}>
          <Text style={ModalStyles.title}>{title}</Text>
          <Text style={ModalStyles.message}>{message}</Text>
          <View style={ModalStyles.actionsRow}>
            <Pressable onPress={onClose} style={ModalStyles.actionButton}>
              <Text style={ModalStyles.actionButtonText}>{strings.close}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
