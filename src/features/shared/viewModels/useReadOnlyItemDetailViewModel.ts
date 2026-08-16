import { useCallback, useState } from "react";

import type { Product, ProductType } from "@/src/features/products/types";
import type { AttachmentGalleryItem } from "@/src/features/attachments/utils/buildAttachmentGallery";

export type NotificationDetailItem = {
  id: string;
  kind: "notification";
  name: string;
  productId?: number;
  category?: string;
  message?: string;
  summary?: string;
  notes?: string;
  attachments?: string[];
  type?: ProductType;
  startDate?: string;
  endDate?: string;
  reminderOption?: string;
};

export const createNotificationDetailItem = (
  input: Partial<NotificationDetailItem> & Pick<NotificationDetailItem, "name">,
): NotificationDetailItem => ({
  id: input.id ?? `${Date.now()}`,
  kind: "notification",
  name: input.name,
  productId: input.productId,
  category: input.category,
  message: input.message,
  summary: input.summary,
  notes: input.notes,
  attachments: input.attachments ?? [],
  type: input.type,
  startDate: input.startDate,
  endDate: input.endDate,
  reminderOption: input.reminderOption,
});

export type ReadOnlyDetailItem = Product | NotificationDetailItem;

export const getDetailProductId = (item: ReadOnlyDetailItem): number => {
  if ("productId" in item && typeof item.productId === "number") {
    return item.productId;
  }

  if (typeof item.id === "number") {
    return item.id;
  }

  const numericId = Number(item.id);
  return Number.isFinite(numericId) ? numericId : 0;
};

export const buildAttachmentGalleryItem = (
  item: ReadOnlyDetailItem,
  uri: string,
): AttachmentGalleryItem => ({
  productId: getDetailProductId(item),
  productName: item.name,
  category: item.category ?? "",
  uri,
});

export function useReadOnlyItemDetailViewModel() {
  const [selectedDetail, setSelectedDetail] = useState<ReadOnlyDetailItem | null>(
    null,
  );
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentGalleryItem | null>(null);

  const openDetail = useCallback((item: ReadOnlyDetailItem) => {
    setSelectedDetail(item);
    setSelectedAttachment(null);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedDetail(null);
    setSelectedAttachment(null);
  }, []);

  const openAttachment = useCallback((item: ReadOnlyDetailItem, uri: string) => {
    setSelectedAttachment(buildAttachmentGalleryItem(item, uri));
  }, []);

  const closeAttachment = useCallback(() => {
    setSelectedAttachment(null);
  }, []);

  return {
    selectedDetail,
    selectedAttachment,
    openDetail,
    closeDetail,
    openAttachment,
    closeAttachment,
  };
}
