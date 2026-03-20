import React from 'react';
import Skeleton from './Skeleton';

const SkeletonCard = ({ hasChart = false }) => {
    return (
        <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm space-y-8 h-full">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton variant="circle" className="w-10 h-10" />
            </div>
            
            {hasChart ? (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-12 rounded-lg" />
                    <Skeleton className="h-3 w-20" />
                </div>
            )}
        </div>
    );
};

export default SkeletonCard;
