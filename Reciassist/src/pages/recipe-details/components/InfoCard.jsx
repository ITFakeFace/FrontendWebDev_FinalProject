import React from 'react';

const InfoCard = ({ icon: Icon, label, value, delay = 0, isLoaded = false }) => (
    <div 
        className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
    >
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export default InfoCard;
