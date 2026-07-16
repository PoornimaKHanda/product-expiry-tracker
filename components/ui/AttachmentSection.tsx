import { strings } from "@/i18n";
import { AttachmentStyles } from "@/styles/attachments";
import { Typography } from "@/theme/typography";
import { pickImageFromCamera, pickImageFromLibrary } from "@/utils/pickImage";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

type Props = {
  attachments: string[];
  onAdd: (uri: string) => Promise<void>;
  onRemove: (uri: string) => void;
  isBusy?: boolean;
};

export function AttachmentSection({
  attachments,
  onAdd,
  onRemove,
  isBusy = false,
}: Props) {
  const handlePick = async (source: "camera" | "library") => {
    const uri =
      source === "camera"
        ? await pickImageFromCamera()
        : await pickImageFromLibrary();

    if (!uri) {
      return;
    }

    await onAdd(uri);
  };

  return (
    <View style={AttachmentStyles.root}>
      <Text style={Typography.label}>{strings.attachmentsLabel}</Text>
      <Text style={[Typography.body, AttachmentStyles.hint]}>
        {strings.attachmentsHint}
      </Text>

      <View style={AttachmentStyles.actionsRow}>
        <Pressable
          style={AttachmentStyles.actionButton}
          disabled={isBusy}
          onPress={() => handlePick("camera")}
        >
          {isBusy ? (
            <ActivityIndicator />
          ) : (
            <Text style={AttachmentStyles.actionButtonText}>
              {strings.takePhoto}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={AttachmentStyles.actionButton}
          disabled={isBusy}
          onPress={() => handlePick("library")}
        >
          <Text style={AttachmentStyles.actionButtonText}>
            {strings.choosePhoto}
          </Text>
        </Pressable>
      </View>

      {attachments.length > 0 ? (
        <View style={AttachmentStyles.thumbnailRow}>
          {attachments.map((uri) => (
            <View key={uri} style={AttachmentStyles.thumbnailWrap}>
              <Image source={{ uri }} style={AttachmentStyles.thumbnail} />
              <Pressable
                style={AttachmentStyles.removeButton}
                onPress={() => onRemove(uri)}
                hitSlop={8}
              >
                <Ionicons name="close" size={14} color="#fff" />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
