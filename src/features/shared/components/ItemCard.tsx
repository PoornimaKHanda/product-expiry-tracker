import { strings } from "@/src/i18n";
import {
  ProductType,
  type ProductType as ProductTypeValue,
} from "@/src/features/products/types";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { ItemCardStyles } from "@/src/styles/item-card";
import { Colors } from "@/src/theme/colors";

type Props = {
  name: string;
  subtitle: string;
  dateLabel: string;
  itemType?: ProductTypeValue;
  showTypeBadge?: boolean;
  hasAttachments?: boolean;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function ItemCard({
  name,
  subtitle,
  dateLabel,
  itemType,
  showTypeBadge = false,
  hasAttachments = false,
  onPress,
  onMenuPress,
}: Props) {
  return (
    <Pressable onPress={onPress}>
      <View style={ItemCardStyles.root}>
        <View style={ItemCardStyles.content}>
          <View style={ItemCardStyles.titleRow}>
            <Text style={ItemCardStyles.title}>{name}</Text>
            {showTypeBadge && itemType ? (
              <View
                style={[
                  ItemCardStyles.badge,
                  itemType === ProductType.EXPIRY
                    ? ItemCardStyles.badgeExpiry
                    : ItemCardStyles.badgeWarranty,
                ]}
              >
                <Text style={ItemCardStyles.badgeText}>
                  {itemType === ProductType.EXPIRY
                    ? strings.expiry
                    : strings.warranty}
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

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onMenuPress?.();
          }}
          hitSlop={10}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </Pressable>
      </View>
    </Pressable>
  );
}
