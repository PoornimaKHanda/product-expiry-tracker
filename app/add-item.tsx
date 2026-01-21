import { Text, View } from "react-native";
import { CommonStyles } from "../styles/common";
import { Typography } from "../theme/typography";

export default function AddItemScreen() {
  return (
    <View style={CommonStyles.screen}>
      <Text style={Typography.title}>Add Item</Text>
      <Text style={Typography.subtitle}>
        Expiry & warranty form coming next
      </Text>
    </View>
  );
}
