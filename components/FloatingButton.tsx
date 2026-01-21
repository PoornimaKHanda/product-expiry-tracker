import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

type Props = {
  onPress: () => void;
};

export function FloatingButton({ onPress }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>＋</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
  },
  text: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 2,
  },
});
