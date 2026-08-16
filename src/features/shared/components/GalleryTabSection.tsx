import { AttachmentGalleryItem } from "@/src/features/attachments/utils/buildAttachmentGallery";
import { SectionHeader } from "@/src/features/shared/components/SectionHeader";
import { strings } from "@/src/i18n";
import { ScreenStyles } from "@/src/styles/screens";
import { Colors } from "@/src/theme/colors";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  items: AttachmentGalleryItem[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectItem: (item: AttachmentGalleryItem) => void;
};

export function GalleryTabSection({
  items,
  searchValue,
  onSearchChange,
  onSelectItem,
}: Props) {
  const filteredItems = React.useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      item.productName.toLowerCase().includes(query),
    );
  }, [items, searchValue]);

  return (
    <>
      <SectionHeader title={strings.galleryTab} />
      <TextInput
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder={strings.gallerySearchPlaceholder}
        style={ScreenStyles.gallerySearch}
        placeholderTextColor={Colors.textSecondary}
      />
      {filteredItems.length === 0 ? (
        <Text style={ScreenStyles.emptyStateText}>
          {strings.galleryEmptyState}
        </Text>
      ) : (
        <View style={ScreenStyles.galleryGrid}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={`${item.productId}-${item.uri}`}
              activeOpacity={0.9}
              style={ScreenStyles.galleryTile}
              onPress={() => onSelectItem(item)}
            >
              <Image
                source={{ uri: item.uri }}
                style={ScreenStyles.galleryImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={ScreenStyles.bottomSpacer} />
    </>
  );
}
