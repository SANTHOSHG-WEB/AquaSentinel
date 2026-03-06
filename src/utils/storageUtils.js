/**
 * Helper functions to manage localStorage for sensor data history
 */

const STORAGE_KEY = 'aqua_sensor_history';
const MAX_HISTORY_POINTS = 100;

export const saveSensorReading = (reading) => {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        const newReading = {
            timestamp: new Date().toISOString(),
            ...reading
        };

        history.push(newReading);

        // Keep only the last N points to avoid bloat
        if (history.length > MAX_HISTORY_POINTS) {
            history.shift();
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving sensor reading to localStorage:', error);
    }
};

export const getSensorHistory = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (error) {
        console.error('Error getting sensor history:', error);
        return [];
    }
};

export const clearSensorHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};
