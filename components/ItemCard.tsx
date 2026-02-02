import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  name: string;
  subtitle: string;
  dateLabel: string;
  onMenuPress?: () => void;
};

export function ItemCard({ name, subtitle, dateLabel, onMenuPress }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{name}</Text>
        <Text style={{ opacity: 0.6 }}>{subtitle}</Text>
        <Text style={{ marginTop: 4 }}>{dateLabel}</Text>
      </View>

      <Pressable onPress={onMenuPress} hitSlop={10}>
        <Ionicons name="ellipsis-vertical" size={22} />
      </Pressable>
    </View>
  );
}
