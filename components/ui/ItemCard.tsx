import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { ItemCardStyles } from "../../styles/item-card";
import { Colors } from "../../theme/colors";

type Props = {
  name: string;
  subtitle: string;
  dateLabel: string;
  onMenuPress?: () => void;
};

export function ItemCard({ name, subtitle, dateLabel, onMenuPress }: Props) {
  return (
    <View style={ItemCardStyles.root}>
      <View style={ItemCardStyles.content}>
        <Text style={ItemCardStyles.title}>{name}</Text>
        <Text style={ItemCardStyles.subtitle}>{subtitle}</Text>
        <Text style={ItemCardStyles.date}>{dateLabel}</Text>
      </View>

      <Pressable onPress={onMenuPress} hitSlop={10}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
      </Pressable>
    </View>
  );
}
