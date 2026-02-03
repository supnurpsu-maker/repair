importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyC1mBineUmQQddHGi539OoYkar_FpL5HOs",
      authDomain: "supnurpsu-9dcb3.firebaseapp.com",
      projectId: "supnurpsu-9dcb3",
      storageBucket: "supnurpsu-9dcb3.firebasestorage.app",
      messagingSenderId: "626588467857",
      appId: "1:626588467857:web:85d8218fa31b8b4f69f530",
      measurementId: "G-GPXP8E1TVM"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ดักจับข้อความเมื่อแอปทำงานอยู่เบื้องหลัง (Background)
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './icon-192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
