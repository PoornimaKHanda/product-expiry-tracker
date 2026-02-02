// import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../utils/db";

export default function RootLayout() {
  useEffect(() => {
    initDB();
    // Notifications.requestPermissionsAsync();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
