import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/AppButton";
import { ItemCard } from "../components/ItemCard";
import { SectionHeader } from "../components/SectionHeader";
import { CommonStyles } from "../styles/common";
import { Typography } from "../theme/typography";

import { formatDate, isWithinNextDays } from "../utils/date";
import { fetchAllProducts } from "../utils/db";

type Product = {
  id: number;
  name: string;
  category: string;
  end_date: string;
  type: "expiry" | "warranty";
};

export default function HomeScreen() {
  const router = useRouter();
  const [expiringSoon, setExpiringSoon] = useState<Product[]>([]);
  const [warrantyEndingSoon, setWarrantyEndingSoon] = useState<Product[]>([]);

  // 🔑 Reload every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    const products = await fetchAllProducts();

    const expiring = products
      .filter((p) => p.type === "expiry" && isWithinNextDays(p.end_date, 30))
      .sort(
        (a, b) =>
          new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
      );

    const warranty = products
      .filter((p) => p.type === "warranty" && isWithinNextDays(p.end_date, 30))
      .sort(
        (a, b) =>
          new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
      );

    setExpiringSoon(expiring);
    setWarrantyEndingSoon(warranty);
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <ScrollView style={CommonStyles.screen}>
        {/* Header */}
        <Text style={Typography.title}>Product Expiry & Warranty Tracker</Text>
        <Text style={Typography.subtitle}>
          Track expiries and warranties without effort
        </Text>

        {/* Expiry Section */}
        <SectionHeader title="EXPIRING SOON" />
        {expiringSoon.length === 0 ? (
          <Text style={{ opacity: 0.6 }}>No products expiring soon 🎉</Text>
        ) : (
          expiringSoon.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              subtitle={item.category}
              dateLabel={`Expires on ${formatDate(item.end_date)}`}
            />
          ))
        )}

        {/* Warranty Section */}
        <SectionHeader title="WARRANTY ENDING SOON" />
        {warrantyEndingSoon.length === 0 ? (
          <Text style={{ opacity: 0.6 }}>No warranties ending soon 🎉</Text>
        ) : (
          warrantyEndingSoon.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              subtitle={item.category}
              dateLabel={`Warranty ends on ${formatDate(item.end_date)}`}
            />
          ))
        )}

        {/* Bottom spacing for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      <AppButton
        kind="floating"
        label="＋"
        onPress={() => router.push("/add-item")}
      />
    </SafeAreaView>
  );
}
