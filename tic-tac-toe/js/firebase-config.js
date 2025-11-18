// Sử dụng cùng config với React app
// # const firebaseConfig = {
// #   apiKey: "AIzaSyByYp04N8j11YKaccPaLtfSCYuw_YWjsb4",
// #   authDomain: "gamelibrary-2e318.firebaseapp.com",
// #   projectId: "gamelibrary-2e318",
// #   storageBucket: "gamelibrary-2e318.firebasestorage.app",
// #   messagingSenderId: "854976634458",
// #   appId: "1:854976634458:web:2c5a8dc37fad134de74263",
// #   measurementId: "G-W7790D168Y"
// # };
const firebaseConfig = {
  apiKey: 'AIzaSyByYp04N8j11YKaccPaLtfSCYuw_YWjsb4',
  authDomain: 'gamelibrary-2e318.firebaseapp.com',
  projectId: 'gamelibrary-2e318',
  storageBucket: 'gamelibrary-2e318.firebasestorage.app',
  messagingSenderId: '854976634458',
  appId: '1:854976634458:web:2c5a8dc37fad134de74263',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
