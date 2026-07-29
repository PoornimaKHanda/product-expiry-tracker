import { ProductProvider } from "@/src/contexts/ProductContext";
import { bootstrapDB } from "@/src/utils/db";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { setupNotificationPermissions } from "../src/utils/notifications";

export default function RootLayout() {

  useEffect(() => {
    bootstrapDB();
    // ✅ Lazy import (prevents crash if native module missing)
    (async () => {
      const { AttachmentService } =
        await import("@/src/services/AttachmentService");
      await AttachmentService.cleanupOrphanedFiles();
    })();

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
