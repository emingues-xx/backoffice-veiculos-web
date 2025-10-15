import React from 'react';

interface MetricCardSkeletonProps {
  className?: string;
}

export const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center">
        {/* Icon skeleton */}
        <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse" />
        
        <div className="ml-4 flex-1">
          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-24" />
          
          {/* Value skeleton */}
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-32" />
          
          {/* Change skeleton */}
          <div className="flex items-center">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton para grid de métricas
export const MetricCardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MetricCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MetricCardSkeleton;
