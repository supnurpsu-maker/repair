const CACHE_NAME = 'admin-cache-v1';
const urlsToCache = [
  './admin.html',
  './manifest.json',
  // ใส่ไฟล์ CSS หรือรูปไอคอนของคุณที่นี่ ถ้ามี
];

// ติดตั้ง Service Worker และ Cache ไฟล์พื้นฐาน
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ดักจับการเรียกไฟล์ (เพื่อให้เปิดแอปเร็วขึ้น)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// ส่วนสำคัญ: ดักจับ Push Notification จาก Firebase
self.addEventListener('push', function(event) {
  let data = { title: 'มีงานใหม่!', body: 'ตรวจสอบรายละเอียดงานซ่อม' };
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: './icon-192.png', // เปลี่ยนเป็นชื่อไฟล์ไอคอนของคุณ
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: './admin.html' // เมื่อคลิกแจ้งเตือนให้เปิดหน้านี้
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// เมื่อคลิกที่ตัวแจ้งเตือน
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
