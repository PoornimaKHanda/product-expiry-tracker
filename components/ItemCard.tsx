import { View, Text } from "react-native";
import { CommonStyles } from "../styles/common";
import { Typography } from "../theme/typography";
import { Colors } from "../theme/colors";

type Props = {
  name: string;
  subtitle: string;
  dateLabel: string;
};

export function ItemCard({ name, subtitle, dateLabel }: Props) {
  return (
    <View style={CommonStyles.card}>
      <Text style={Typography.body}>{name}</Text>

      <Text style={{ marginTop: 4, color: Colors.textSecondary }}>
        {subtitle}
      </Text>

      <Text style={{ marginTop: 6, color: Colors.danger }}>{dateLabel}</Text>
    </View>
  );
}
