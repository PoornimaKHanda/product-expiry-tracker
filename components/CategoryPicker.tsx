import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonStyles } from "../styles/common";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

const DEFAULT_CATEGORIES = [
  "Groceries",
  "Makeup",
  "Skincare",
  "Medicines",
  "Electronics",
  "Appliances",
];

const STORAGE_KEY = "USER_CATEGORIES";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function CategoryPicker({ value, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [addingCustom, setAddingCustom] = useState(false);
  const [customText, setCustomText] = useState("");

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    setCategories([...DEFAULT_CATEGORIES, ...parsed]);
  };

  const saveCustomCategory = async () => {
    if (!customText.trim()) return;

    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!parsed.includes(customText)) {
      const updated = [...parsed, customText];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setCategories([...DEFAULT_CATEGORIES, ...updated]);
    }

    onChange(customText);
    setCustomText("");
    setAddingCustom(false);
    setVisible(false);
  };

  return (
    <View style={CommonStyles.pickerContainer}>
      <Text style={[Typography.label, { marginBottom: Spacing.xs }]}>
        Category
      </Text>

      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={CommonStyles.pickerTrigger}
      >
        <Text
          style={[
            Typography.body,
            { color: value ? Colors.textPrimary : Colors.textSecondary },
          ]}
        >
          {value || "Select category"}
        </Text>
        <Text style={{ color: Colors.textSecondary, marginLeft: 8 }}>▼</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              margin: 20,
              borderRadius: 12,
              padding: 16,
              maxHeight: "70%",
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 12 }}>
              Select Category
            </Text>

            {!addingCustom ? (
              <>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item);
                        setVisible(false);
                      }}
                      style={CommonStyles.listItem}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  onPress={() => setAddingCustom(true)}
                  style={{ padding: 12 }}
                >
                  <Text style={{ color: Colors.primary }}>
                    + Add Custom Category
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  placeholder="Enter category"
                  value={customText}
                  onChangeText={setCustomText}
                  style={CommonStyles.inputHighlighted}
                />

                <View style={CommonStyles.actionRow}>
                  <TouchableOpacity
                    onPress={saveCustomCategory}
                    disabled={!customText.trim()}
                    style={[
                      CommonStyles.saveButton,
                      !customText.trim() && { backgroundColor: Colors.muted },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.body,
                        {
                          color: !customText.trim()
                            ? Colors.textSecondary
                            : "#fff",
                        },
                      ]}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setAddingCustom(false);
                      setCustomText("");
                    }}
                    style={CommonStyles.cancelButton}
                  >
                    <Text style={[Typography.body, { color: Colors.danger }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
