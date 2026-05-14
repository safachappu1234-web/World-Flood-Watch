import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase config - get this from Firebase Console > Project Settings > General > Web app
const firebaseConfig = {
  apiKey: "AlZaSyBb_Cb12KP7bi9UWUD3GH0501i6UNEtU4Y",
  authDomain: "world-flood-watch.firebaseapp.com",
  projectId: "world-flood-watch",
  storageBucket: "world-flood-watch.firebasestorage.app",
  messagingSenderId: "406955303083",
  appId: "1:406955303083:web:80e8c267b8ecaff5e957ee",
  measurementId: "G-FJZTJ6FL6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // Destroy existing map if it exists
    if (window.map) {
        window.map.remove();
    }
    
    // Create fresh map
    window.map = L.map('map').setView([11.84, 75.56], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(window.map);    }

    // Button click event
    document.getElementById('simulateBtn').addEventListener('click', async function() {
        try {
            // 1. Add red dot to map
            L.circleMarker([11.87, 75.35], {
                radius: 10,
                fillColor: "#dc2626",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(window.map).bindPopup("NEW DANGER REPORT: Koothuparamba area");

            // 2. Save report to Firestore
            await addDoc(collection(db, "flood_reports"), {
                location: "Koothuparamba",
                lat: 11.87,
                lng: 75.35,
                waterLevel: 2.5,
                status: "DANGER",
                timestamp: new Date()
            });
            console.log("Report added to Firestore");

            // 3. Update status bar
            var bar = document.getElementById('alertBar');
            var status = document.getElementById('statusText');
            var time = document.getElementById('updateTime');

            if (bar) bar.style.background = '#dc2626';
            if (status) status.innerText = 'DANGER';
            if (time) time.innerText = new Date().toLocaleTimeString();
        } catch (error) {
            console.error("Error:", error);
        }
    });
});