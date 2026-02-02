import { Modal, Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";

type Props = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ItemActionSheet({ visible, onClose, onEdit, onDelete }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      {/* Blur background */}
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <BlurView
          intensity={40}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Pressable
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Pressable onPress={onEdit}>
              <Text style={{ fontSize: 18, marginBottom: 16 }}>✏️ Edit</Text>
            </Pressable>

            <Pressable onPress={onDelete}>
              <Text style={{ fontSize: 18, color: "red", marginBottom: 16 }}>
                🗑️ Delete
              </Text>
            </Pressable>

            <Pressable onPress={onClose}>
              <Text style={{ fontSize: 16, opacity: 0.6 }}>Cancel</Text>
            </Pressable>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
}
