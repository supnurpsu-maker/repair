importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// 1. การตั้งค่า Firebase
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

    // ดึงข้อมูลจาก payload.data (ที่ส่งมาจาก GAS)
    const data = payload.data || {};
    
    // ค่า Title และ Body จะถูกเตรียมมาจาก GAS (รวมเครื่องหมาย ✅/❌ ใน Body แล้ว)
    const title = data.title || "แจ้งเตือนงานซ่อม";
    const body = data.body || "มีรายการใหม่เข้ามา"; 
    const icon = data.icon || 'https://supnurpsu-maker.github.io/repair/icon-192.png';
    const clickUrl = data.url || 'https://supnurpsu-maker.github.io/repair/admin.html';

    // 3. ตั้งค่ารูปแบบการแจ้งเตือน
    const notificationOptions = {
        body: body,
        icon: icon,
        badge: icon,
        // ใช้ timestamp เป็น tag เพื่อให้แจ้งเตือนเด้งแยกกันทุกรายการ ไม่ทับกัน
        tag: 'repair-system-' + Date.now(),
        renotify: true, 
        vibrate: [200, 100, 200],
        data: {
            url: clickUrl
        }
        // หมายเหตุ: ตัด notificationOptions.image ออกตามความต้องการ 
        // เพื่อให้แสดงผลเฉพาะข้อความแจ้งสถานะรูปภาพแทนการโหลดรูปจริง
    };

    return self.registration.showNotification(title, notificationOptions);
});

// 4. ฟังก์ชันจัดการเมื่อผู้ใช้คลิกที่ตัว Notification
self.addEventListener('notificationclick', function(event) {
    console.log('[sw.js] Notification clicked');
    
    event.notification.close();

    const urlToOpen = event.notification.data?.url || 'https://supnurpsu-maker.github.io/repair/admin.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function(windowClients) {
                // ตรวจสอบว่าหน้า Admin เปิดอยู่แล้วหรือไม่
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    // ถ้าเปิดหน้า Admin อยู่แล้ว ให้ Focus ไปที่หน้านั้นเลย
                    if (client.url.indexOf('admin.html') !== -1 && 'focus' in client) {
                        return client.focus();
                    }
                }
                // ถ้ายังไม่เปิด ให้เปิดหน้าต่างใหม่ตาม URL ที่ส่งมา
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
