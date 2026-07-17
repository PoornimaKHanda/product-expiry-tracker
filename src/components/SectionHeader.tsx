import { Text, View } from "react-native";
import { SectionHeaderStyles } from "../styles/section-header";
import { Typography } from "../theme/typography";

type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return (
    <View style={SectionHeaderStyles.root}>
      <Text style={Typography.sectionTitle}>{title}</Text>
    </View>
  );
}
