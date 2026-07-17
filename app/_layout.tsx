import { ProductProvider } from "@/contexts/ProductContext";
import { bootstrapDB } from "@/utils/db";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { setupNotificationPermissions } from "../utils/notifications";

bootstrapDB();
export default function RootLayout() {
  useEffect(() => {
    setupNotificationPermissions().catch((error) => {
      console.warn("Unable to set up notifications", error);
    });
  }, []);

  return (
    <ProductProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="add-item" />
      </Stack>
    </ProductProvider>
  );
}
