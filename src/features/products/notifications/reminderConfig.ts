export type ReminderOptionValue = string;
export type ReminderOffsetDays = number;
export type TrackableType = 'expiry' | 'warranty';

export const reminderConfig = Object.freeze({
  defaultOffsets: [7, 0],
  customOffsets: {
    '1day': [1],
    '1week': [7],
    '1month': [30],
  },
});

export function getReminderOffsets(reminderOption?: ReminderOptionValue): number[] {
  if (!reminderOption || reminderOption === 'automatic') {
    return [...reminderConfig.defaultOffsets];
  }

  const explicit = reminderConfig.customOffsets[reminderOption as keyof typeof reminderConfig.customOffsets];
  if (explicit) {
    return [...explicit];
  }

  if (reminderOption.startsWith('custom:')) {
    const parsedDays = Number(reminderOption.split(':')[1]);
    if (Number.isFinite(parsedDays) && parsedDays > 0) {
      return [parsedDays];
    }
  }

  return [...reminderConfig.defaultOffsets];
}

export const getItemNotificationIdentifier = (
  productId: number,
  type: TrackableType,
  offsetDays: ReminderOffsetDays,
) => `product-${productId}-${type}-${offsetDays}-days`;
