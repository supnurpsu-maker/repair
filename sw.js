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

// ฟังก์ชันรับข้อความ (ทำงานใน Background)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // 1. ดึงข้อมูลจาก payload.data เป็นหลัก (เพราะ GAS เราจะส่งแบบ data)
    // ใช้เครื่องหมาย ?. เพื่อกัน Error กรณีค่าเป็น null
    const title = payload.data?.title || "แจ้งเตือนงานซ่อม";
    const body = payload.data?.body || "มีรายการใหม่";
    const icon = payload.data?.icon || 'https://supnurpsu-maker.github.io/repair/icon-192.png';
    const clickUrl = payload.data?.url || 'admin.html';

    // 2. ตั้งค่า Notification Options
    const notificationOptions = {
        body: body,
        icon: icon,
        image: payload.data?.image,
        badge: icon, // สำหรับ Android จะโชว์รูปเล็กๆ
        tag: 'repair-system', // tag เดิมจะถูกแทนที่ด้วยอันใหม่ (กันข้อความซ้อน)
        renotify: true, // บังคับให้สั่น/เตือนเสียงทุกครั้งที่ข้อความเข้า
        data: {
            url: clickUrl
        }
    };

    // 3. สั่งแสดงผล
    return self.registration.showNotification(title, notificationOptions);
});

// ฟังก์ชันจัดการเมื่อผู้ใช้คลิกที่แจ้งเตือน
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // ปิด popup

    // เปิดหน้า admin.html
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(function(windowClients) {
            // ถ้าเปิดอยู่แล้วให้ Focus
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.indexOf('admin.html') !== -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // ถ้ายังไม่เปิด ให้เปิดใหม่
            if (clients.openWindow) {
                const urlToOpen = event.notification.data.url || 'admin.html';
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
