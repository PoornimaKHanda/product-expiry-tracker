import type { Product } from '@/src/features/products/types';
import {
    cancelItemNotifications,
    scheduleItemNotifications,
} from '@/src/features/products/notifications/notificationScheduler';

export const productNotificationService = {
    async scheduleForProduct(p: Product) {
        return scheduleItemNotifications({
            id: p.id,
            name: p.name,
            endDate: p.endDate,
            type: p.type,
            reminderOption: p.reminderOption,
            allowExpoGo: true,
        });
    },

    async cancelForProductId(id: number) {
        return cancelItemNotifications(id);
    },
};

export default productNotificationService;
