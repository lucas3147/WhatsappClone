export async function allowNotifications() {
    let granted : Boolean = false;

    await Notification.requestPermission().then(permission => {
        granted = permission === "granted";
    });

    return granted;
}