import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className, variant = 'rect' }) => {
    return (
        <div 
            className={clsx(
                "animate-shimmer",
                variant === 'circle' ? "rounded-full" : "rounded-xl",
                className
            )}
        />
    );
};

export default Skeleton;
