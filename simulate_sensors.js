import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();

// Initialize Firebase Admin (using standard SDK with project config)
const firebaseConfig = {
    apiKey: "AIzaSyDxbDncNNIfYuAIY3tnJDYjXZtcmLuAaNA",
    authDomain: "aqua-fa925.firebaseapp.com",
    databaseURL: "https://aqua-fa925-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aqua-fa925",
    storageBucket: "aqua-fa925.firebasestorage.app",
    messagingSenderId: "24671990034",
    appId: "1:24671990034:web:28405436aae20b6e60c3cb",
    measurementId: "G-RXP4W066K9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const CSV_FILE = path.join(__dirname, 'local_sensors.csv');

// Track last hash to prevent duplicate pushes on double-fires from OS
let lastDataStr = '';

console.log('💧 Aquasentinel Live CSV Hardware Simulator Started');
console.log(`📡 Watching for changes in: ${CSV_FILE}`);
console.log('⚙️  Waiting for Ctrl+S in Excel/Notepad...\n');

const processCsvAndPush = () => {
    try {
        // Use readFileSync to read the entire file quickly and drop the lock
        const fileContent = fs.readFileSync(CSV_FILE, 'utf-8');
        const lines = fileContent.trim().split('\n');

        if (lines.length < 2) return; // Need headers + at least 1 row

        const headers = lines[0].split(',').map(h => h.trim());
        const lastLineValues = lines[lines.length - 1].split(',').map(v => v.trim());

        const currentRow = {};
        headers.forEach((header, index) => {
            currentRow[header] = lastLineValues[index];
        });

        const dataStr = JSON.stringify(currentRow);
        if (dataStr === lastDataStr) return; // Ignore duplicate events
        lastDataStr = dataStr;

        const updateData = {
            tankLevel: Math.max(0, Math.min(100, Number(currentRow.tankLevel) || 0)),
            soilMoisture: Math.max(0, Math.min(100, Number(currentRow.soilMoisture) || 0)),
            rainValue: Math.max(0, Number(currentRow.rainValue) || 0),
            isRaining: Number(currentRow.rainValue) > 0,
            waterFlow: Math.max(0, Number(currentRow.waterFlow) || 0),
            leakage: String(currentRow.leakage).toLowerCase() === 'true'
        };

        const sensorsRef = ref(db, `devices/device_001/data/sensors`);

        update(sensorsRef, updateData)
            .then(() => {
                console.log(`\n✅ [${new Date().toLocaleTimeString()}] Pushed Update to Firebase:`);
                console.log(`   -> Flow: ${updateData.waterFlow} L/m`);
                console.log(`   -> Leakage: ${updateData.leakage ? 'DETECTED 🚨' : 'Clear'}`);
                console.log(`   -> Tank: ${updateData.tankLevel}% | Moisture: ${updateData.soilMoisture}% | Rain: ${updateData.rainValue}mm`);
            })
            .catch((error) => {
                console.error('❌ Failed to push to Firebase:', error);
            });
    } catch (err) {
        // Ignore EBUSY if we happen to read at the exact microsecond the file is writing
        if (err.code !== 'EBUSY') {
            console.error('Error reading CSV:', err.message);
        }
    }
};

// Bulletproof File Polling for Windows
// Instead of hooking into OS events which lock the file, we just casually check if the 
// 'last modified' time changed. This requires ZERO active file handles.
let lastMtime = 0;

console.log('💧 Aquasentinel Live CSV Hardware Simulator Started (Anti-Lock Mode)');
console.log(`📡 Polling for changes in: ${CSV_FILE}`);
console.log('⚙️  Waiting for Ctrl+S in Excel/Notepad...\n');

setInterval(() => {
    try {
        const stats = fs.statSync(CSV_FILE);
        if (stats.mtimeMs > lastMtime) {
            // Only push if it's not the very first startup read
            if (lastMtime !== 0) {
                // Wait 200ms for VS Code/Excel to finish atomic writing
                setTimeout(() => processCsvAndPush(), 200);
            } else {
                // First run, just execute immediately to sync state
                processCsvAndPush();
            }
            lastMtime = stats.mtimeMs;
        }
    } catch (err) {
        // File might be temporarily missing during atomic save replacements, just ignore until next tick
    }
}, 500);
