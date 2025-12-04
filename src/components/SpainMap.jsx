import React from 'react';
import { motion } from 'framer-motion';

const SpainMap = ({ regions }) => {
    const getPosition = (regionName) => {
        switch (regionName) {
            case 'Comunidad de Madrid': return { top: '48%', left: '42%' };  // Centro de España
            case 'Cataluña': return { top: '32%', left: '72%' };  // Noreste
            case 'Andalucía': return { top: '72%', left: '35%' };  // Sur
            case 'País Vasco': return { top: '22%', left: '48%' };  // Norte (cerca de Francia)
            default: return { top: '50%', left: '50%' };
        }
    };

    return (
        <div className="card" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px', background: '#0f172a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }} className="font-bold">Vista Geográfica</h3>

            {/* Map Image */}
            <img
                src="/spain_map.png"
                alt="Mapa de España"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: 0.9,
                    zIndex: 5
                }}
                onError={(e) => {
                    console.error('Error loading map image');
                    e.target.style.display = 'none';
                }}
            />

            {/* Bubbles */}
            {regions.map((region) => {
                const pos = getPosition(region.name);
                const size = Math.max(region.score, 70);

                return (
                    <motion.div
                        key={region.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        style={{
                            position: 'absolute',
                            top: pos.top,
                            left: pos.left,
                            width: `${size}px`,
                            height: `${size}px`,
                            borderRadius: '50%',
                            background: region.score > 80 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                            border: `3px solid ${region.score > 80 ? '#10b981' : '#f59e0b'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 25px rgba(0,0,0,0.6)',
                            zIndex: 20
                        }}
                        title={`${region.name}: ${region.score}`}
                    >
                        <div className="text-center" style={{ pointerEvents: 'none' }}>
                            <div className="font-bold text-white text-xs" style={{ textShadow: '0 1px 2px black' }}>{region.name}</div>
                            <div className="text-white text-xs font-bold">{region.score}</div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default SpainMap;
