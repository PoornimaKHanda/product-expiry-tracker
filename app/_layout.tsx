import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../utils/db";
import { setupNotificationPermissions } from "../utils/notifications";

export default function RootLayout() {
  useEffect(() => {
    initDB();

    setupNotificationPermissions().catch((error) => {
      console.warn("Unable to set up notifications", error);
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
