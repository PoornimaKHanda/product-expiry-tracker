import { strings } from "@/src/i18n";
import { SectionHeader } from "@/src/features/shared/components/SectionHeader";
import { ItemCard } from "@/src/features/shared/components/ItemCard";
import { ProductType } from "@/src/features/products/types";
import { formatDate } from "@/src/utils/date";
import { Text, View } from "react-native";
import { ScreenStyles } from "@/src/styles/screens";

import type { Product } from "@/src/features/products/types";

type Props = {
  title: string;
  items: Product[];
  emptyText: string;
  showTypeBadge?: boolean;
  onOpenItem: (item: Product) => void;
  onOpenMenu: (item: Product) => void;
};

export function ProductListSection({
  title,
  items,
  emptyText,
  showTypeBadge = false,
  onOpenItem,
  onOpenMenu,
}: Props) {
  return (
    <>
      <SectionHeader title={title} />
      {items.length === 0 ? (
        <Text style={ScreenStyles.emptyStateText}>{emptyText}</Text>
      ) : (
        items.map((item) => (
          <ItemCard
            key={item.id}
            name={item.name}
            subtitle={item.category}
            dateLabel={
              item.type === ProductType.EXPIRY
                ? strings.expiresOn(formatDate(item.endDate))
                : strings.warrantyEndsOn(formatDate(item.endDate))
            }
            itemType={item.type}
            showTypeBadge={showTypeBadge}
            hasAttachments={(item.attachments || []).length > 0}
            onPress={() => onOpenItem(item)}
            onMenuPress={() => onOpenMenu(item)}
          />
        ))
      )}
    </>
  );
}
