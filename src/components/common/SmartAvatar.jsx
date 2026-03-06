import React from 'react';
import { motion } from 'framer-motion';
import './SmartAvatar.css';

const SmartAvatar = ({ state = 'healthy', message = '' }) => {
    const getAvatarEmoji = () => {
        switch (state) {
            case 'weak': return '🥀';
            case 'warning': return '⚠️';
            case 'super': return '⚡';
            default: return '🌿';
        }
    };

    const getAuraColor = () => {
        switch (state) {
            case 'weak': return 'rgba(239, 68, 68, 0.3)';
            case 'warning': return 'rgba(234, 179, 8, 0.3)';
            case 'super': return 'rgba(168, 85, 247, 0.3)';
            default: return 'rgba(34, 197, 94, 0.3)';
        }
    };

    return (
        <div className="avatar-container">
            <motion.div
                className="avatar-aura"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundColor: getAuraColor() }}
            />
            <motion.div
                className="avatar-face"
                whileHover={{ scale: 1.1 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
