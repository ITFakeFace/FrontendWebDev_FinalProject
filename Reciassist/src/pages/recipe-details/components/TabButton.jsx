import React from 'react';

const TabButton = ({ id, label, isActive, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            isActive 
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`}
    >
        {label}
    </button>
);

export default TabButton;