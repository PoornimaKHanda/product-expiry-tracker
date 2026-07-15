import { BlurView } from "expo-blur";
import { Modal, Pressable, Text } from "react-native";
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
      <Pressable style={ActionSheetStyles.fullScreen} onPress={onClose}>
        <BlurView intensity={40} style={ActionSheetStyles.blurContainer}>
          <Pressable style={ActionSheetStyles.sheet}>
            <Pressable onPress={onEdit}>
              <Text style={ActionSheetStyles.actionText}>✏️ Edit</Text>
            </Pressable>

            <Pressable onPress={onDelete}>
              <Text style={ActionSheetStyles.deleteText}>🗑️ Delete</Text>
            </Pressable>

            <Pressable onPress={onClose}>
              <Text style={ActionSheetStyles.cancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
}
