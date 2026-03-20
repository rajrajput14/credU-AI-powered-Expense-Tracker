import React from 'react';
import Skeleton from './Skeleton';

const SkeletonTableRow = () => {
    return (
        <div className="flex items-center justify-between p-3 border-b border-outline-variant/5 last:border-0">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-5 w-20" />
        </div>
    );
};

export default SkeletonTableRow;
