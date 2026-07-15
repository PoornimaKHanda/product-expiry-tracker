import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../utils/db";
import { setupNotificationPermissions } from "../utils/notifications";
import { ProductProvider } from "@/contexts/ProductContext";

export default function RootLayout() {
  useEffect(() => {
    initDB();
    setupNotificationPermissions().catch((error) => {
      console.warn("Unable to set up notifications", error);
    });
  }, []);

  return (
    <ProductProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ProductProvider>
  );
}
