import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../utils/firebase';
import { supabase } from '../utils/supabase';
import { saveSensorReading } from '../utils/storageUtils';

export const useSensorData = (deviceId = 'device_001') => {
    const [data, setData] = useState({
        tankLevel: 0,
        soilMoisture: 0,
        rainValue: 0,
        isRaining: false,
        waterFlow: 0,
        leakage: false,
        motors: {
            tankMotor: false,
            gardenMotor: false,
            autoMode: true
        },
        loading: true,
        error: null
    });

    useEffect(() => {
        // 1. Firebase Subscription (Consolidated)
        const dataRef = ref(db, `devices/${deviceId}/data`);
        const unsubscribeFirebase = onValue(dataRef, (snapshot) => {
            const val = snapshot.val();
            if (val && val.sensors) {
                const s = val.sensors;
                const newData = {
                    tankLevel: s.tankLevel || 0,
                    soilMoisture: s.soilMoisture || 0,
                    rainValue: s.rainValue || 0,
                    isRaining: s.isRaining || false,
                    waterFlow: s.waterFlow || 0,
                    leakage: s.leakage || false,
                    motors: {
                        tankMotor: val.motors?.tankMotor || false,
                        gardenMotor: val.motors?.gardenMotor || false,
                        autoMode: val.motors?.autoMode || false,
                        emergencyStop: val.motors?.emergencyStop || false
                    }
                };

                setData(prev => ({
                    ...prev,
                    ...newData,
                    loading: false
                }));

                // Save to localStorage for history
                saveSensorReading({
                    tankLevel: newData.tankLevel,
                    soilMoisture: newData.soilMoisture,
                    waterFlow: newData.waterFlow
                });
            }
        }, (err) => {
            setData(prev => ({ ...prev, loading: false, error: err.message }));
        });

        return () => {
            unsubscribeFirebase();
        };
    }, [deviceId]);

    return data;
};
