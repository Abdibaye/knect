import React from "react";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 animate-pulse">
      <div className="max-full mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Skeleton */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-gray-300 dark:bg-zinc-800" />
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 px-6 pt-2 pb-6">
                <div className="w-32 h-32 bg-gray-300 dark:bg-zinc-800 rounded-full border-4 border-white dark:border-gray-700 -mt-16 mb-4 sm:mb-0" />
                <div className="flex-1">
                  <div className="h-6 w-40 bg-gray-300 dark:bg-zinc-800 rounded mb-2" />
                  <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="flex items-center mt-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded mr-2" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-10 w-24 bg-gray-300 dark:bg-zinc-800 rounded" />
                    <div className="h-10 w-24 bg-gray-300 dark:bg-zinc-800 rounded" />
                    <div className="h-10 w-10 bg-gray-300 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              </div>
            </div>
            {/* About Section Skeleton */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6">
              <div className="h-6 w-32 bg-gray-300 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
            {/* Activity Section Skeleton */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-6 w-32 bg-gray-300 dark:bg-zinc-800 rounded" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded" />
              </div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded mb-4" />
              <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
            {/* Experience Section Skeleton */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6">
              <div className="h-6 w-40 bg-gray-300 dark:bg-zinc-800 rounded mb-4" />
              <div className="flex space-x-4 mb-6">
                <div className="w-12 h-12 bg-gray-300 dark:bg-zinc-800 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 rounded" />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-zinc-800 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 rounded" />
                </div>
              </div>
            </div>
          </div>
          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 w-32 bg-gray-300 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
