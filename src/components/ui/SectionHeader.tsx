import { Text, View } from "react-native";
import { SectionHeaderStyles } from "@/src/styles/section-header";
import { Typography } from "@/src/theme/typography";

type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return (
    <View style={SectionHeaderStyles.root}>
      <Text style={Typography.label}>{title}</Text>
    </View>
  );
}
