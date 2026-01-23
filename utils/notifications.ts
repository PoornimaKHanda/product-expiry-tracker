// import * as Notifications from "expo-notifications";

// export async function scheduleNotifications(
//     id: number,
//     name: string,
//     endDate: string,
//     type: "expiry" | "warranty"
// ) {
//     const end = new Date(endDate);
//     const reminder = new Date(end);
//     reminder.setDate(end.getDate() - 30);

//     const title =
//         type === "expiry"
//             ? "Product Expiring Soon"
//             : "Warranty Ending Soon";

//     // 30-day reminder
//     if (reminder > new Date()) {
//         await Notifications.scheduleNotificationAsync({
//             content: {
//                 title,
//                 body: `${name} expires in 30 days`,
//             },
//             trigger: reminder,
//         });
//     }

//     // Final day notification
//     if (end > new Date()) {
//         await Notifications.scheduleNotificationAsync({
//             content: {
//                 title,
//                 body:
//                     type === "expiry"
//                         ? `${name} has expired`
//                         : `${name}'s warranty ends today`,
//             },
//             trigger: end,
//         });
//     }
// }
// export async function scheduleNotifications(
//     id: number,
//     name: string,
//     endDate: string,
//     type: "expiry" | "warranty"
// ) {
//     const title =
//         type === "expiry"
//             ? "Product Expiring Soon"
//             : "Warranty Ending Soon";

//     // 🔔 TEST NOTIFICATION (fires in 10 seconds)
//     await Notifications.scheduleNotificationAsync({
//         content: {
//             title,
//             body: `${name} test notification`,
//         },
//         trigger: {
//             seconds: 10,
//         },
//     });
// }
