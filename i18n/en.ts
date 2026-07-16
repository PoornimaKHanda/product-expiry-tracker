export type ReminderOption = {
    label: string;
    value: string;
};

export const en = {
    appTitle: "Product Expiry & Warranty Tracker",
    appSubtitle: "Track expiries and warranties without effort",

    sectionExpiringSoon: "EXPIRING SOON",
    sectionWarrantyEndingSoon: "WARRANTY ENDING SOON",
    emptyExpiringSoon: "No products expiring soon 🎉",
    emptyWarrantyEndingSoon: "No warranties ending soon 🎉",

    addProduct: "Add Product",
    addItem: "Add Item",
    editItem: "Edit Item",
    editMode: "Edit mode",
    addMode: "Add mode",
    updateProductDetails: "Update product details",
    trackProductExpiryOrWarranty: "Track product expiry or warranty",

    productNameLabel: "Product Name",
    productNamePlaceholder: "Enter product name",
    notesLabel: "Notes (optional)",
    notesPlaceholder: "Any extra info",

    expiry: "Expiry",
    warranty: "Warranty",
    openedPurchaseDate: "Opened / Purchase Date",
    purchaseDate: "Purchase Date",
    expiryDate: "Expiry Date",
    warrantyEndDate: "Warranty End Date",

    category: "Category",
    selectCategory: "Select category",
    selectCategoryTitle: "Select Category",
    addCustomCategory: "+ Add Custom Category",
    enterCategory: "Enter category",

    reminder: "Reminder",
    selectReminder: "Select reminder",
    selectReminderTitle: "Select Reminder",
    addCustomReminder: "+ Add Custom Reminder",
    enterDaysBeforeExpiry: "Enter days before expiry",

    save: "Save",
    update: "Update",
    cancel: "Cancel",
    close: "Close",
    deleteItem: "Delete Item",
    deleteItemConfirm: "This cannot be undone.",
    delete: "Delete",
    cancelButton: "Cancel",

    sendTestNotification: "Send Test Notification",

    selectDate: "Select date",
    expiresOn: (date: string) => `Expires on ${date}`,
    warrantyEndsOn: (date: string) => `Warranty ends on ${date}`,
    notificationChannelName: "Expiry reminders",
    notificationChannelDescription: "Expiry and warranty reminder alerts",

    productExpiresToday: "Product expires today",
    productExpiringSoon: "Product expiring soon",
    warrantyEndsToday: "Warranty ends today",
    warrantyEndingSoon: "Warranty ending soon",
    productExpiresTodayBody: (name: string) => `${name} expires today.`,
    productExpiringSoonBody: (name: string, days: number) =>
        `${name} expires in ${days} days.`,
    warrantyEndsTodayBody: (name: string) => `${name}'s warranty ends today.`,
    warrantyEndingSoonBody: (name: string, days: number) =>
        `${name}'s warranty ends in ${days} days.`,
    testReminderTitle: "Test reminder",
    testReminderBody: "Local notifications are working.",
    testNotificationScheduled: "Test notification scheduled",
    notificationsUnavailable: "Notifications unavailable",
    notificationPermissionStatus: (granted: boolean) =>
        `Permission: ${granted ? "granted" : "not granted"}`,
    testNotificationPermissionInstructions:
        "Check notification permissions for Expo Go, or use a development build if Expo Go cannot schedule notifications on this device.",

    itemNotFound: "Item not found",
    fillRequiredFields: "Please fill required fields",
    errorSavingItem: "Error saving item",
    errorSchedulingTestNotification: "Error scheduling test notification",

    defaultCategories: [
        "Groceries",
        "Makeup",
        "Skincare",
        "Medicines",
        "Electronics",
        "Appliances",
    ] as const,

    defaultReminders: [
        { label: "Automatic (7 days before)", value: "automatic" },
        { label: "1 day before", value: "1day" },
        { label: "1 week before", value: "1week" },
        { label: "1 month before", value: "1month" },
    ] as const,

    customReminderLabel: (days: number) =>
        `Custom (${days} day${days === 1 ? "" : "s"} before)`,
};
