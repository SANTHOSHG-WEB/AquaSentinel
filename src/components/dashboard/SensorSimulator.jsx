import React, { useState, useRef } from 'react';
import { Upload, Play, Square, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { ref, update } from 'firebase/database';
import { db } from '../../utils/firebase';
import GlassCard from '../common/GlassCard';
import './SensorSimulator.css';

const SensorSimulator = ({ deviceId = 'device_001' }) => {
    const [fileStats, setFileStats] = useState(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'running', 'finished', 'error'
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const dataRef = useRef([]);
    const intervalRef = useRef(null);
    const uploadRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                const requiredHeaders = ['tankLevel', 'soilMoisture', 'rainValue', 'waterFlow'];
                const headers = results.meta.fields;

                const missing = requiredHeaders.filter(h => !headers.includes(h));
                if (missing.length > 0) {
                    setStatus('error');
                    setErrorMsg(`Missing columns: ${missing.join(', ')}`);
                    return;
                }

                dataRef.current = results.data;
                setFileStats({
                    filename: file.name,
                    rows: results.data.length
                });
                setStatus('idle');
                setProgress(0);
                setErrorMsg('');
            },
            error: (err) => {
                setStatus('error');
                setErrorMsg('Failed to parse CSV: ' + err.message);
            }
        });
    };

    const pushReading = (row) => {
        const sensorsRef = ref(db, `devices/${deviceId}/data`);
        update(sensorsRef, {
            sensors: {
                tankLevel: Math.max(0, Math.min(100, Number(row.tankLevel) || 0)),
                soilMoisture: Math.max(0, Math.min(100, Number(row.soilMoisture) || 0)),
                rainValue: Math.max(0, Number(row.rainValue) || 0),
                isRaining: Number(row.rainValue) > 0,
                waterFlow: Math.max(0, Number(row.waterFlow) || 0)
            }
        });
    };

    const startSimulation = () => {
        if (!dataRef.current.length) return;

        setStatus('running');
        let currentIndex = progress;

        intervalRef.current = setInterval(() => {
            if (currentIndex >= dataRef.current.length) {
                stopSimulation(true);
                return;
            }

            pushReading(dataRef.current[currentIndex]);
            currentIndex++;
            setProgress(currentIndex);
        }, 3000); // 3 seconds per row
    };

    const stopSimulation = (finished = false) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setStatus(finished ? 'finished' : 'idle');
    };

    const downloadTemplate = () => {
        const headers = "time_seconds,tankLevel,soilMoisture,rainValue,waterFlow\n";
        const sampleRows = "0,80,45,0,0\n3,75,44,0,12\n6,70,43,0,15\n9,60,60,20,0\n12,65,70,50,0";
        const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "aquasentinel_sensor_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <GlassCard title="Hardware Simulator (CSV)" icon={FileText} className="simulator-card" delay={400}>
            <div className="simulator-content">
                <p className="sim-desc">
                    Upload a CSV file to simulate live hardware sensors. The system will broadcast one row of data every 3 seconds.
                </p>

                <div className="upload-zone" onClick={() => uploadRef.current?.click()}>
                    <input
                        type="file"
                        accept=".csv"
                        ref={uploadRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <Upload size={32} className="upload-icon" />
                    {fileStats ? (
                        <div className="file-info">
                            <strong>{fileStats.filename}</strong>
                            <span>{fileStats.rows} data points loaded</span>
                        </div>
                    ) : (
                        <span>Click to upload CSV File</span>
                    )}
                </div>

                {status === 'error' && (
                    <div className="sim-alert error">
                        <AlertCircle size={16} />
                        {errorMsg}
                    </div>
                )}

                {status === 'finished' && (
                    <div className="sim-alert success">
                        <CheckCircle2 size={16} />
                        Simulation complete! End of file reached.
                    </div>
                )}

                <div className="sim-controls">
                    <button className="btn-template" onClick={downloadTemplate}>
                        Download Template
                    </button>

                    <div className="playback-controls">
                        {status === 'running' ? (
                            <button className="btn-stop" onClick={() => stopSimulation()}>
                                <Square size={16} /> Stop
                            </button>
                        ) : (
                            <button
                                className="btn-play"
                                onClick={startSimulation}
                                disabled={!fileStats || progress >= dataRef.current.length}
                            >
                                <Play size={16} /> Start
                            </button>
                        )}
                    </div>
                </div>

                {fileStats && (
                    <div className="sim-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(progress / fileStats.rows) * 100}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">
                            {progress} / {fileStats.rows} rows executed
                        </span>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

export default SensorSimulator;
