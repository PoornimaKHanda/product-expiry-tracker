import { useRouter } from "expo-router";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ItemCard } from "../components/ItemCard";
import { SectionHeader } from "../components/SectionHeader";
import { CommonStyles } from "../styles/common";
import { Typography } from "../theme/typography";
import { AppButton } from "@/components/AppButton";

export default function HomeScreen() {
  const router = useRouter();
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

        <ItemCard
          name="Blush"
          subtitle="Makeup"
          dateLabel="Expires on 15 Feb 2026"
        />

        <ItemCard
          name="Lip Balm"
          subtitle="Skincare"
          dateLabel="Expires on 10 Feb 2026"
        />

        {/* Warranty Section */}
        <SectionHeader title="WARRANTY ENDING SOON" />

        <ItemCard
          name="Power Drill"
          subtitle="Electronics"
          dateLabel="Warranty ends on 12 Mar 2026"
        />
      </ScrollView>
      <AppButton
        kind="floating"
        label="＋"
        onPress={() => router.push("/add-item")}
      />
    </SafeAreaView>
  );
}
