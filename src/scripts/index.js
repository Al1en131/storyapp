import "../styles/styles.css";
import App from "./pages/app";
import CONFIG from "./config";

async function sendSubscriptionToServer(subscription) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token tidak ditemukan saat subscribe.");
    return;
  }

  const response = await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.getKey("p256dh")
          ? btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("p256dh"))
              )
            )
          : null,
        auth: subscription.getKey("auth")
          ? btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("auth"))
              )
            )
          : null,
      },
    }),
  });

  const result = await response.json();
  console.log("Response dari server saat subscribe:", result);
}

async function removeSubscriptionFromServer(endpoint) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token tidak ditemukan saat unsubscribe.");
    return;
  }

  const response = await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });

  const result = await response.json();
  console.log("Response dari server saat unsubscribe:", result);
}

async function setupPushButtons(registration) {
  console.log("SetupPushButtons called", registration);
  const subscribeBtn = document.getElementById("subscribe-btn");
  const unsubscribeBtn = document.getElementById("unsubscribe-btn");

  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Token tidak ditemukan, tombol notifikasi tidak akan aktif.");
    subscribeBtn.disabled = true;
    unsubscribeBtn.disabled = true;
    return;
  }

  if (!subscribeBtn || !unsubscribeBtn) {
    console.warn("Tombol subscribe/unsubscribe tidak ditemukan di DOM.");
    return;
  }

  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    subscribeBtn.style.display = "none";
    unsubscribeBtn.style.display = "inline-block";
  } else {
    subscribeBtn.style.display = "inline-block";
    unsubscribeBtn.style.display = "none";
  }

  subscribeBtn.onclick = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Izin notifikasi ditolak");
      return;
    }

    try {
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",
      });

      console.log("Berhasil subscribe:", newSubscription);

      await sendSubscriptionToServer(newSubscription);

      subscribeBtn.style.display = "none";
      unsubscribeBtn.style.display = "inline-block";
    } catch (err) {
      console.error("Gagal subscribe:", err);
    }
  };

  unsubscribeBtn.onclick = async () => {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log("Berhasil unsubscribe");

      await removeSubscriptionFromServer(subscription.endpoint);

      subscribeBtn.style.display = "inline-block";
      unsubscribeBtn.style.display = "none";
    }
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();

  console.log("Subscribe button:", document.getElementById("subscribe-btn"));
  console.log("Unsubscribe button:", document.getElementById("unsubscribe-btn"));

  let registration;
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker terdaftar:", registration);
      await setupPushButtons(registration);
    } catch (err) {
      console.error("Service Worker gagal terdaftar:", err);
    }
  }

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    if (registration) await setupPushButtons(registration);
  });
});
