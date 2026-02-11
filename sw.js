importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// 1. การตั้งค่า Firebase (ใช้ค่าเดิมของคุณ)
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

// 2. ฟังก์ชันรับข้อความขณะแอปอยู่ที่ Background หรือปิดอยู่
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // ดึงข้อมูลจาก payload.data (ซึ่งส่งมาจาก GAS)
    const data = payload.data || {};
    
    const title = data.title || "แจ้งเตือนงานซ่อม";
    const body = data.body || "มีรายการแจ้งซ่อมใหม่เข้ามา";
    const icon = data.icon || 'https://supnurpsu-maker.github.io/repair/icon-192.png';
    const clickUrl = data.url || 'https://supnurpsu-maker.github.io/repair/admin.html';

    // 3. ตั้งค่ารูปแบบการแจ้งเตือน
    const notificationOptions = {
        body: body,
        icon: icon,
        badge: icon,
        // ใช้ timestamp เป็น tag เพื่อให้แจ้งเตือนเด้งใหม่ทุกครั้ง ไม่ทับของเดิมที่ยังไม่ได้กดอ่าน
        tag: 'repair-ticket-' + Date.now(), 
        renotify: true, // สั่นและแจ้งเตือนเสียงแม้จะเป็นกลุ่มเดียวกัน
        vibrate: [200, 100, 200], // รูปแบบการสั่น (สำหรับ Android)
        data: {
            url: clickUrl
        }
    };

    // ตรวจสอบและใส่รูปภาพประกอบ (ถ้ามีส่งมาจาก GAS)
    if (data.image && data.image.startsWith('http')) {
        notificationOptions.image = data.image;
    }

    return self.registration.showNotification(title, notificationOptions);
});

// 4. ฟังก์ชันจัดการเมื่อผู้ใช้คลิกที่ตัว Notification
self.addEventListener('notificationclick', function(event) {
    console.log('[sw.js] Notification clicked');
    
    // ปิดตัวแจ้งเตือนที่คลิก
    event.notification.close();

    // ดึง URL ที่แนบมากับ data (ถ้าไม่มีให้ไปหน้า admin หลัก)
    const urlToOpen = event.notification.data?.url || 'https://supnurpsu-maker.github.io/repair/admin.html';

    // ตรวจสอบว่ามีหน้าต่างเว็บเปิดอยู่แล้วหรือไม่
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function(windowClients) {
                // ถ้ามีหน้าต่างเปิดอยู่แล้ว ให้ Focus ไปที่หน้าต่างนั้น
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // ถ้ายังไม่เปิด หรือหาไม่เจอ ให้เปิดหน้าต่างใหม่
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
