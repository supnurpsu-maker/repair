importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyC1mBineUmQQddHGi539OoYkar_FpL5HOs",
    authDomain: "supnurpsu-9dcb3.firebaseapp.com",
    projectId: "supnurpsu-9dcb3",
    storageBucket: "supnurpsu-9dcb3.firebasestorage.app",
    messagingSenderId: "626588467857",
    appId: "1:626588467857:web:85d8218fa31b8b4f69f530"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const data = payload.data || {};
    
    const title = data.title || "แจ้งเตือนงานซ่อม";
    const body = data.body || "มีรายการใหม่";
    const icon = data.icon || 'https://supnurpsu-maker.github.io/repair/icon-192.png';
    const clickUrl = data.url || 'https://supnurpsu-maker.github.io/repair/admin.html';

    // *** แก้ไขจุดสำคัญ: ตรวจสอบรูปภาพก่อนใส่ options ***
    const notificationOptions = {
        body: body,
        icon: icon,
        badge: icon,
        tag: 'repair-system-' + Date.now(), // เปลี่ยน tag ให้ไม่ซ้ำ เพื่อให้แจ้งเตือนเด้งทุกครั้ง ไม่ทับอันเดิม
        renotify: true,
        data: {
            url: clickUrl
        }
    };

    // ใส่รูปภาพเฉพาะเมื่อมี URL จริงๆ เท่านั้น (แก้ปัญหาแจ้งเตือนไม่เด้งเพราะรูปว่าง)
    if (data.image && data.image.startsWith('http')) {
        notificationOptions.image = data.image;
    }

    return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(function(windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // เช็คว่า URL มีคำว่า admin.html หรือไม่
                if (client.url.indexOf('admin.html') !== -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                // ดึง URL จาก data ที่เราแนบไว้
                const urlToOpen = event.notification.data?.url || 'https://supnurpsu-maker.github.io/repair/admin.html';
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
