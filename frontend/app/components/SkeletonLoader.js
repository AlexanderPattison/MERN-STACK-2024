// src/components/SkeletonLoader.js
'use client'

import React from 'react';

const SkeletonLoader = () => (
    <div className="skeleton-loader">
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
    </div>
);

export default SkeletonLoader;