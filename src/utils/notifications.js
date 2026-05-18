export const requestNotificationPermission =
  async () => {
    // browser support check
    if (!("Notification" in window)) {
      console.log(
        "This browser does not support notifications",
      );

      return false;
    }

    const permission =
      await Notification.requestPermission();

    return permission === "granted";
  };

export const showNotification = ({
  title,
  body,
  icon = "/vite.svg",
}) => {
  if (Notification.permission !== "granted")
    return;

  new Notification(title, {
    body,
    icon,
    badge: icon,
  });
};

