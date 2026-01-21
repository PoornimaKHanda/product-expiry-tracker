import { View, Text } from "react-native";
import { Typography } from "../theme/typography";
import { Spacing } from "../theme/spacing";

type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return (
    <View style={{ marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
      <Text style={Typography.label}>{title}</Text>
    </View>
  );
}
