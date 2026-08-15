import { ProductProvider } from "@/src/features/products";
import { bootstrapDB } from "@/src/features/products/repository/productRepository";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { setupNotificationPermissions } from "@/src/features/products/notifications/notificationScheduler";

export default function RootLayout() {
  useEffect(() => {
    bootstrapDB();
    // ✅ Lazy import (prevents crash if native module missing)
    (async () => {
      const { AttachmentService } =
        await import("@/src/features/attachments/services/AttachmentService");
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
