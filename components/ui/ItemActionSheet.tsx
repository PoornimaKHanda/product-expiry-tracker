import { strings } from "@/i18n";
import { BlurView } from "expo-blur";
import {
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ActionSheetStyles } from "../../styles/action-sheet";

type Props = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ItemActionSheet({ visible, onClose, onEdit, onDelete }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={ActionSheetStyles.fullScreen}>
        <BlurView
          intensity={80}
          tint="light"
          style={ActionSheetStyles.absoluteFill}
        />
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={ActionSheetStyles.overlay} />
        </TouchableWithoutFeedback>

        <View style={ActionSheetStyles.sheet}>
          <Pressable style={ActionSheetStyles.actionButton} onPress={onEdit}>
            <Text style={ActionSheetStyles.actionText}>
              ✏️ {strings.editItem}
            </Text>
          </Pressable>

          <Pressable
            style={[
              ActionSheetStyles.actionButton,
              ActionSheetStyles.deleteButton,
            ]}
            onPress={onDelete}
          >
            <Text
              style={[
                ActionSheetStyles.actionText,
                ActionSheetStyles.deleteText,
              ]}
            >
              🗑️ {strings.delete}
            </Text>
          </Pressable>

          <Pressable style={ActionSheetStyles.cancelButton} onPress={onClose}>
            <Text style={ActionSheetStyles.cancelText}>{strings.cancel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
