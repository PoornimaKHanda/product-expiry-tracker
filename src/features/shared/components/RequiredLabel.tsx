import { Text } from "react-native";
import { RequiredLabelStyles } from "@/src/styles/required-label";
import { Typography } from "@/src/theme/typography";

type Props = {
  children: string;
  required?: boolean;
};

export function RequiredLabel({ children, required = false }: Props) {
  return (
    <Text style={Typography.label}>
      {children}
      {required && <Text style={RequiredLabelStyles.indicator}> *</Text>}
    </Text>
  );
}
