import React from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../../utils/firebase';
import { Settings, ShieldAlert } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import './RelayControl.css';

const RelayControl = ({ motors, deviceId = 'device_001' }) => {
    const { tankMotor, gardenMotor, autoMode, emergencyStop } = motors;

    const sendCommand = (command, value) => {
        if (emergencyStop && command !== 'emergencyStop') return;

        const commandRef = ref(db, `devices/${deviceId}/commands/${command}`);
        set(commandRef, value);
    };

    const triggerEmergencyStop = () => {
        // According to user's hardware logic, we send OFF to both motors
        sendCommand('tankMotor', 'OFF');
        sendCommand('gardenMotor', 'OFF');

        // We also toggle the emergency stop state if applicable
        const emergencyRef = ref(db, `devices/${deviceId}/commands/emergencyStop`);
        set(emergencyRef, !emergencyStop ? 'ON' : 'OFF');

        // Ensure manual mode is set for safety
        sendCommand('mode', 'MANUAL');
    };

    return (
        <GlassCard title="System Control" icon={Settings} className="relay-control-card" delay={300}>
            <div className="relay-interface">
                {/* Tank Motor Control */}
                <div className="control-section">
                    <h3>Tank Motor</h3>
                    <div className="button-group">
                        <button
                            className={`btn-ctrl btn-on ${tankMotor ? 'active' : ''} ${emergencyStop ? 'disabled' : ''}`}
                            onClick={() => sendCommand('tankMotor', 'ON')}
                            disabled={emergencyStop}
                        >
                            ON
                        </button>
                        <button
                            className={`btn-ctrl btn-off ${!tankMotor ? 'active' : ''} ${emergencyStop ? 'disabled' : ''}`}
                            onClick={() => sendCommand('tankMotor', 'OFF')}
                            disabled={emergencyStop}
                        >
                            OFF
                        </button>
                    </div>
                </div>

                {/* Garden Motor Control */}
                <div className="control-section">
                    <h3>Garden Motor</h3>
                    <div className="button-group">
                        <button
                            className={`btn-ctrl btn-on ${gardenMotor ? 'active' : ''} ${emergencyStop ? 'disabled' : ''}`}
                            onClick={() => sendCommand('gardenMotor', 'ON')}
                            disabled={emergencyStop}
                        >
                            ON
                        </button>
                        <button
                            className={`btn-ctrl btn-off ${!gardenMotor ? 'active' : ''} ${emergencyStop ? 'disabled' : ''}`}
                            onClick={() => sendCommand('gardenMotor', 'OFF')}
                            disabled={emergencyStop}
                        >
                            OFF
                        </button>
                    </div>
                </div>

                {/* System Mode Control */}
                <div className="mode-section">
                    <button
                        className={`btn-mode ${autoMode ? 'active' : ''} ${emergencyStop ? 'disabled' : ''}`}
                        onClick={() => sendCommand('mode', 'AUTO')}
                        disabled={emergencyStop}
                    >
                        Set AUTO
                    </button>
                    <button
                        className={`btn-mode ${!autoMode ? 'active' : ''} ${emergencyStop ? 'disabled' : ''}`}
                        onClick={() => sendCommand('mode', 'MANUAL')}
                        disabled={emergencyStop}
                    >
                        Set MANUAL
                    </button>
                </div>

                {/* Emergency Stop */}
                <button
                    className={`btn-emergency-stop ${emergencyStop ? 'triggered' : ''}`}
                    onClick={triggerEmergencyStop}
                >
                    <ShieldAlert size={20} />
                    <span>EMERGENCY STOP</span>
                </button>
            </div>
        </GlassCard>
    );
};

export default RelayControl;
