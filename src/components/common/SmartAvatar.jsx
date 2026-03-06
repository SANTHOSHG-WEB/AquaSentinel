import React from 'react';
import { motion } from 'framer-motion';
import './SmartAvatar.css';

const SmartAvatar = ({ state = 'healthy', message = '' }) => {
    const getAvatarEmoji = () => {
        switch (state) {
            case 'critical': return '🥵'; // Low water urgency
            case 'warning': return '💧';  // Medium/Normal
            case 'super': return '😎';    // Full tank cool
            default: return '💧';
        }
    };

    const getAuraColor = () => {
        switch (state) {
            case 'critical': return 'rgba(239, 68, 68, 0.4)'; // Red pulse
            case 'warning': return 'rgba(249, 115, 22, 0.3)'; // Orange accent pulse
            case 'super': return 'rgba(16, 185, 129, 0.4)';  // Green powerful pulse
            default: return 'rgba(16, 185, 129, 0.3)';
        }
    };

    const getAnimationProps = () => {
        switch (state) {
            case 'critical':
                return { duration: 0.8, yRange: [0, -15, 0], scaleRange: [1, 1.3, 1] }; // Fast panic
            case 'warning':
                return { duration: 2.5, yRange: [0, -8, 0], scaleRange: [1, 1.15, 1] }; // Chill float
            case 'super':
                return { duration: 1.5, yRange: [0, -12, 0], scaleRange: [1, 1.25, 1] }; // Powerful bounce
            default:
                return { duration: 2.5, yRange: [0, -8, 0], scaleRange: [1, 1.15, 1] };
        }
    };

    const animConfig = getAnimationProps();

    return (
        <div className="avatar-container">
            <motion.div
                className="avatar-aura"
                animate={{
                    scale: animConfig.scaleRange,
                    opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: animConfig.duration, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundColor: getAuraColor() }}
            />
            <motion.div
                className="avatar-face"
                whileHover={{ scale: 1.1 }}
                animate={{ y: animConfig.yRange }}
                transition={{ duration: animConfig.duration, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="avatar-emoji">{getAvatarEmoji()}</span>
            </motion.div>
            {message && (
                <motion.div
                    className="avatar-bubble"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {message}
                </motion.div>
            )}
        </div>
    );
};

export default SmartAvatar;
