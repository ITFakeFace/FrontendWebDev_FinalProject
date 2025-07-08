import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 'w-4 h-4' }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`${size} ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

export default StarRating;