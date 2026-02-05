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

// ฟังก์ชันรับข้อความขณะปิดแอป หรือแอปอยู่เบื้องหลัง
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    
    // ดึงค่าจาก data ทั้งหมด (ตามที่ GAS ส่งมา)
    const title = payload.data.title || "แจ้งเตือนงานซ่อม";
    const body = payload.data.body || "มีรายการแจ้งซ่อมใหม่";
    
    const notificationOptions = {
        body: body,
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        tag: 'repair-notification', // ป้องกัน Noti ซ้อนกัน
        renotify: true,
        data: {
            url: 'admin.html' 
        }
    };

    self.registration.showNotification(title, notificationOptions);
});
