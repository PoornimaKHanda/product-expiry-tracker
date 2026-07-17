import { strings } from "@/i18n";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { ItemCardStyles } from "../../styles/item-card";
import { Colors } from "../../theme/colors";

type Props = {
  name: string;
  subtitle: string;
  dateLabel: string;
  itemType?: "expiry" | "warranty";
  showTypeBadge?: boolean;
  hasAttachments?: boolean;
  onMenuPress?: () => void;
};

export function ItemCard({
  name,
  subtitle,
  dateLabel,
  itemType,
  showTypeBadge = false,
  hasAttachments = false,
  onMenuPress,
}: Props) {
  return (
    <View style={ItemCardStyles.root}>
      <View style={ItemCardStyles.content}>
        <View style={ItemCardStyles.titleRow}>
          <Text style={ItemCardStyles.title}>{name}</Text>
          {showTypeBadge && itemType ? (
            <View
              style={[
                ItemCardStyles.badge,
                itemType === "expiry"
                  ? ItemCardStyles.badgeExpiry
                  : ItemCardStyles.badgeWarranty,
              ]}
            >
              <Text style={ItemCardStyles.badgeText}>
                {itemType === "expiry" ? strings.expiry : strings.warranty}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={ItemCardStyles.subtitle}>{subtitle}</Text>
        <Text style={ItemCardStyles.date}>{dateLabel}</Text>
        {hasAttachments ? (
          <View style={ItemCardStyles.attachmentRow}>
            <Ionicons name="attach" size={16} color={Colors.textMuted} />
            <Text style={ItemCardStyles.attachmentText}>
              {strings.hasAttachments}
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable onPress={onMenuPress} hitSlop={10}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
      </Pressable>
    </View>
  );
}
