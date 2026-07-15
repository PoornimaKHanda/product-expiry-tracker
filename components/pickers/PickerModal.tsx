import { strings } from "@/i18n";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonStyles } from "../../styles/common";
import { ModalStyles } from "../../styles/modals";
import { PickerStyles } from "../../styles/pickers";
import { Typography } from "../../theme/typography";

type PickerOption = {
  label: string;
  value: string;
};

type Props = {
  visible: boolean;
  title: string;
  items: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  addButtonLabel: string;
  isAddingCustom: boolean;
  onStartAddCustom: () => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  onSaveCustom: () => void;
  onCancelCustom: () => void;
  customPlaceholder: string;
};

export function PickerModal({
  visible,
  title,
  items,
  selectedValue,
  onSelect,
  onClose,
  addButtonLabel,
  isAddingCustom,
  onStartAddCustom,
  customText,
  onCustomTextChange,
  onSaveCustom,
  onCancelCustom,
  customPlaceholder,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ModalStyles.overlay}>
        <View style={ModalStyles.card}>
          <Text style={ModalStyles.title}>{title}</Text>

          {!isAddingCustom ? (
            <>
              <FlatList
                data={items}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = item.value === selectedValue;
                  return (
                    <TouchableOpacity
                      onPress={() => onSelect(item.value)}
                      style={CommonStyles.listItem}
                    >
                      <Text
                        style={[
                          PickerStyles.optionText,
                          isSelected && PickerStyles.selectedOptionText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />

              <TouchableOpacity
                onPress={onStartAddCustom}
                style={ModalStyles.addButton}
              >
                <Text style={ModalStyles.addButtonText}>{addButtonLabel}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                placeholder={customPlaceholder}
                value={customText}
                onChangeText={onCustomTextChange}
                style={CommonStyles.inputHighlighted}
              />

              <View style={CommonStyles.actionRow}>
                <TouchableOpacity
                  onPress={onSaveCustom}
                  disabled={!customText.trim()}
                  style={[
                    CommonStyles.saveButton,
                    !customText.trim() && PickerStyles.disabledButton,
                  ]}
                >
                  <Text
                    style={[
                      Typography.body,
                      !customText.trim()
                        ? PickerStyles.saveTextDisabled
                        : PickerStyles.saveText,
                    ]}
                  >
                    {strings.save}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onCancelCustom}
                  style={CommonStyles.cancelButton}
                >
                  <Text style={[Typography.body, PickerStyles.cancelText]}>
                    {strings.cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity onPress={onClose} style={ModalStyles.addButton}>
            <Text style={ModalStyles.addButtonText}>{strings.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
