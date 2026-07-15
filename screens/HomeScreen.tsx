import {
  AppButton,
  ItemActionSheet,
  ItemCard,
  SectionHeader,
} from "@/components/ui";
import { useProductsContext } from "@/contexts/ProductContext";
import { CommonStyles } from "@/styles/common";
import { ScreenStyles } from "@/styles/screens";
import { Typography } from "@/theme/typography";
import { formatDate } from "@/utils/date";
import { deleteProductById } from "@/utils/db";
import { cancelItemNotifications } from "@/utils/notifications";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  id: number;
  name: string;
  category: string;
  end_date: string;
  type: "expiry" | "warranty";
};

export default function HomeScreen() {
  const router = useRouter();
  const { expiringSoon, warrantyEndingSoon, refreshProducts } =
    useProductsContext();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  const openActions = (item: Product) => {
    setSelectedItem(item);
    setShowSheet(true);
  };

  useFocusEffect(
    useCallback(() => {
      refreshProducts();
    }, [refreshProducts]),
  );

  return (
    <SafeAreaView edges={["top", "bottom"]} style={ScreenStyles.root}>
      <ScrollView style={CommonStyles.screen}>
        <Text style={Typography.title}>Product Expiry & Warranty Tracker</Text>
        <Text style={Typography.subtitle}>
          Track expiries and warranties without effort
        </Text>

        <SectionHeader title="EXPIRING SOON" />
        {expiringSoon.length === 0 ? (
          <Text style={ScreenStyles.emptyStateText}>
            No products expiring soon 🎉
          </Text>
        ) : (
          expiringSoon.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              subtitle={item.category}
              dateLabel={`Expires on ${formatDate(item.end_date)}`}
              onMenuPress={() => openActions(item)}
            />
          ))
        )}

        <SectionHeader title="WARRANTY ENDING SOON" />
        {warrantyEndingSoon.length === 0 ? (
          <Text style={ScreenStyles.emptyStateText}>
            No warranties ending soon 🎉
          </Text>
        ) : (
          warrantyEndingSoon.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              subtitle={item.category}
              dateLabel={`Warranty ends on ${formatDate(item.end_date)}`}
              onMenuPress={() => openActions(item)}
            />
          ))
        )}

        <View style={ScreenStyles.bottomSpacer} />
      </ScrollView>

      <View style={ScreenStyles.fabContainer}>
        <AppButton
          kind="floating"
          label="＋"
          onPress={() => router.push("/add-item")}
        />
      </View>

      <ItemActionSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onEdit={() => {
          if (!selectedItem) return;
          setShowSheet(false);
          router.push({
            pathname: "/add-item",
            params: { id: selectedItem.id },
          });
        }}
        onDelete={() => {
          if (!selectedItem) return;

          Alert.alert("Delete Item", "This cannot be undone.", [
            { text: "Cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await cancelItemNotifications(selectedItem.id);
                await deleteProductById(selectedItem.id);
                refreshProducts();
              },
            },
          ]);

          setShowSheet(false);
        }}
      />
    </SafeAreaView>
  );
}
