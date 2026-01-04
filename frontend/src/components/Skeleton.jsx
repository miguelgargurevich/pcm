import React from 'react';

const FormSkeleton = ({ showSteps = true, showHeader = true }) => {
  return (
    <div className="p-4">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      
      {/* Header Skeleton */}
      {showHeader && (
        <div className="mb-6">
          <div className="h-8 shimmer rounded w-96 mb-3"></div>
          <div className="p-4 bg-gray-50 border-l-4 border-gray-200 rounded-r-lg">
            <div className="h-4 shimmer rounded w-48 mb-2"></div>
            <div className="h-6 shimmer rounded w-80"></div>
          </div>
        </div>
      )}

      {/* Steps Skeleton */}
      {showSteps && (
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-8 h-8 shimmer rounded-full flex items-center justify-center mr-2"></div>
                <div className="h-4 shimmer rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Content Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        {/* Form Fields */}
        {[1, 2, 3, 4].map((field) => (
          <div key={field} className="space-y-2">
            <div className="h-4 shimmer rounded w-32"></div>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
        ))}

        {/* Textarea Fields */}
        <div className="space-y-2">
          <div className="h-4 shimmer rounded w-40"></div>
          <div className="h-24 bg-gray-100 rounded border"></div>
        </div>

        {/* Additional Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 shimmer rounded w-28"></div>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 shimmer rounded w-36"></div>
            <div className="h-10 bg-gray-100 rounded border"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="mt-6 flex justify-between items-center">
        <div className="h-10 shimmer rounded w-24"></div>
        <div className="flex space-x-3">
          <div className="h-10 shimmer rounded w-20"></div>
          <div className="h-10 shimmer rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="p-6 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((card) => (
          <div key={card} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="p-6">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded mx-2"></div>
            ))}
          </div>
        </div>
        
        {/* Table Rows */}
        <div className="divide-y">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }, (_, colIndex) => (
                  <div key={colIndex} className="mx-2">
                    <div className="h-4 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-100 rounded"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              <div className="h-3 bg-gray-100 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentSkeleton = ({ showHeader = true, showFilters = false }) => {
  return (
    <div className="animate-pulse">
      {/* Page Header */}
      {showHeader && (
        <div className="mb-6 p-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      )}

      {/* Filter Bar */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg border">
          <div className="flex gap-4">
            <div className="h-10 bg-gray-100 rounded w-48"></div>
            <div className="h-10 bg-gray-100 rounded w-32"></div>
            <div className="h-10 bg-gray-100 rounded w-24"></div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-8 bg-gray-100 rounded w-20"></div>
              <div className="h-8 bg-gray-100 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { FormSkeleton, DashboardSkeleton, TableSkeleton, CardSkeleton, ContentSkeleton };
export default FormSkeleton;