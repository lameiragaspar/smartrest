// Animate.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Animate(props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100%',
            }}
        >
            {props.children}
        </motion.div>
    );
}
