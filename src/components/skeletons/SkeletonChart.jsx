import React from 'react';
import Skeleton from './Skeleton';

const SkeletonChart = ({ className }) => {
    return (
        <div className={`bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            
            <div className="h-48 w-full flex items-end gap-2 px-10 relative">
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between py-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-2 w-6" />
                    ))}
                </div>
                <div className="flex-1 h-full flex items-end justify-between gap-2 border-b border-outline-variant/10 pb-2">
                    {[60, 40, 80, 50, 70, 30].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <Skeleton className="w-full rounded-t-sm" style={{ height: `${h}%` }} />
                            <Skeleton className="h-2 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkeletonChart;
