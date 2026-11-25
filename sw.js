// sw.js - Service Worker for FCM background notifications
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBR4GptcMhTYBT_3uHMG3modZlcw5AMsp8",
  authDomain: "foyer-famille.firebaseapp.com",
  projectId: "foyer-famille",
  storageBucket: "foyer-famille.firebasestorage.app",
  messagingSenderId: "746008298979",
  appId: "1:746008298979:web:9ace12bb9b6a5ce06accd6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Foyer';
  const notificationOptions = {
    body: payload.notification?.body || 'Nouvelle entrée',
    icon: './apple-touch-icon.png',
    badge: './apple-touch-icon.png',
    data: payload.data || {}
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('foyer') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
