import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../utils/db";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
