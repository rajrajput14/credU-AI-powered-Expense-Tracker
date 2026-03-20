import React from 'react';
import Skeleton from './Skeleton';

const SkeletonText = ({ lines = 1, className }) => {
    return (
        <div className={className}>
            {[...Array(lines)].map((_, i) => (
                <Skeleton 
                    key={i} 
                    className={`h-4 w-full mb-2 last:mb-0 ${i === lines - 1 && lines > 1 ? 'w-2/3' : ''}`} 
                />
            ))}
        </div>
    );
};

export default SkeletonText;
