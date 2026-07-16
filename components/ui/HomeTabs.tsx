import { strings } from "@/i18n";
import { CommonStyles } from "@/styles/common";
import { Text, TouchableOpacity, View } from "react-native";

type TabKey = "home" | "all";

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function HomeTabs({ activeTab, onChange }: Props) {
  return (
    <View style={CommonStyles.tabBar}>
      <TouchableOpacity
        style={[
          CommonStyles.tabButton,
          activeTab === "home" && CommonStyles.tabButtonActive,
        ]}
        onPress={() => onChange("home")}
      >
        <Text
          style={[
            CommonStyles.tabButtonText,
            activeTab === "home" && CommonStyles.tabButtonTextActive,
          ]}
        >
          {strings.homeTab}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          CommonStyles.tabButton,
          activeTab === "all" && CommonStyles.tabButtonActive,
        ]}
        onPress={() => onChange("all")}
      >
        <Text
          style={[
            CommonStyles.tabButtonText,
            activeTab === "all" && CommonStyles.tabButtonTextActive,
          ]}
        >
          {strings.allItemsTab}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
