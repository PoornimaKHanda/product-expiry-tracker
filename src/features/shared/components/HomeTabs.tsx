import { TabType } from "@/src/features/shared/TabType";
import { strings } from "@/src/i18n";
import { CommonStyles } from "@/src/styles/common";
import { Text, TouchableOpacity, View } from "react-native";

type TabKey = (typeof TabType)[keyof typeof TabType];

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
          activeTab === TabType.HOME && CommonStyles.tabButtonActive,
        ]}
        onPress={() => onChange(TabType.HOME)}
      >
        <Text
          style={[
            CommonStyles.tabButtonText,
            activeTab === TabType.HOME && CommonStyles.tabButtonTextActive,
          ]}
        >
          {strings.homeTab}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          CommonStyles.tabButton,
          activeTab === TabType.ALL && CommonStyles.tabButtonActive,
        ]}
        onPress={() => onChange(TabType.ALL)}
      >
        <Text
          style={[
            CommonStyles.tabButtonText,
            activeTab === TabType.ALL && CommonStyles.tabButtonTextActive,
          ]}
        >
          {strings.allItemsTab}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          CommonStyles.tabButton,
          activeTab === TabType.GALLERY && CommonStyles.tabButtonActive,
        ]}
        onPress={() => onChange(TabType.GALLERY)}
      >
        <Text
          style={[
            CommonStyles.tabButtonText,
            activeTab === TabType.GALLERY && CommonStyles.tabButtonTextActive,
          ]}
        >
          {strings.galleryTab}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
