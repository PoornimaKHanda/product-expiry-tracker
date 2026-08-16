import { ProductType } from "@/src/features/products/types";
import { strings } from "@/src/i18n";
import { ModalStyles } from "@/src/styles/modals";
import { ScreenStyles } from "@/src/styles/screens";
import { Colors } from "@/src/theme/colors";
import { Typography } from "@/src/theme/typography";
import { formatDate } from "@/src/utils/date";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { ReadOnlyDetailItem } from "@/src/features/shared/viewModels/useReadOnlyItemDetailViewModel";

type Props = {
  visible: boolean;
  item: ReadOnlyDetailItem | null;
  onClose: () => void;
  onPreviewAttachment: (item: ReadOnlyDetailItem, uri: string) => void;
};

export function ReadOnlyDetailModal({
  visible,
  item,
  onClose,
  onPreviewAttachment,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={ModalStyles.overlay}>
        <View style={[ModalStyles.card, { maxHeight: "82%" }]}>
          <View style={ScreenStyles.previewHeader}>
            <Text style={ModalStyles.title}>{strings.readOnlyMode}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={[
                  ModalStyles.actionButtonText,
                  { color: Colors.primary },
                ]}
              >
                {strings.close}
              </Text>
            </TouchableOpacity>
          </View>

          {item ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[Typography.title, { fontSize: 24, marginBottom: 8 }]}
              >
                {item.name}
              </Text>

              {"category" in item && item.category ? (
                <Text style={[Typography.subtitle, { marginBottom: 16 }]}>
                  {item.category}
                </Text>
              ) : null}

              {"type" in item && item.type ? (
                <Text style={[Typography.body, { marginBottom: 8 }]}>
                  <Text style={{ fontWeight: "700" }}>{strings.expiry}: </Text>
                  {item.type === ProductType.EXPIRY
                    ? strings.expiry
                    : strings.warranty}
                </Text>
              ) : null}

              {"startDate" in item && item.startDate ? (
                <Text style={[Typography.body, { marginBottom: 8 }]}>
                  <Text style={{ fontWeight: "700" }}>
                    {strings.purchaseDate}:{" "}
                  </Text>
                  {formatDate(item.startDate)}
                </Text>
              ) : null}

              {"endDate" in item && item.endDate ? (
                <Text style={[Typography.body, { marginBottom: 8 }]}>
                  <Text style={{ fontWeight: "700" }}>
                    {"type" in item && item.type === ProductType.EXPIRY
                      ? strings.expiryDate
                      : strings.warrantyEndDate}
                    :
                  </Text>
                  {formatDate(item.endDate)}
                </Text>
              ) : null}

              {"reminderOption" in item && item.reminderOption ? (
                <Text style={[Typography.body, { marginBottom: 8 }]}>
                  <Text style={{ fontWeight: "700" }}>
                    {strings.reminder}:{" "}
                  </Text>
                  {item.reminderOption}
                </Text>
              ) : null}

              {"summary" in item && item.summary ? (
                <View style={{ marginTop: 12, marginBottom: 16 }}>
                  <Text style={{ fontWeight: "700", marginBottom: 4 }}>
                    {strings.notesLabel}
                  </Text>
                  <Text style={Typography.body}>{item.summary}</Text>
                </View>
              ) : null}

              {"notes" in item && item.notes ? (
                <View style={{ marginTop: 12, marginBottom: 16 }}>
                  <Text style={{ fontWeight: "700", marginBottom: 4 }}>
                    {strings.notesLabel}
                  </Text>
                  <Text style={Typography.body}>{item.notes}</Text>
                </View>
              ) : null}

              {item.attachments?.length ? (
                <View>
                  <Text style={{ fontWeight: "700", marginBottom: 10 }}>
                    {strings.attachmentsLabel}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {item.attachments.map((uri) => (
                      <TouchableOpacity
                        key={uri}
                        onPress={() => onPreviewAttachment(item, uri)}
                      >
                        <Image
                          source={{ uri }}
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: 12,
                            backgroundColor: Colors.surfaceSoft,
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
