import { motion } from 'framer-motion';

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow p-5 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-xl bg-gray-200"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mt-1"></div>
      </div>
    </div>
  </div>
);

export const SkeletonNewsCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
    <div className="h-56 bg-gray-200"></div>
    <div className="p-5">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
    <div className="bg-gray-100 p-4">
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="divide-y divide-gray-100">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 flex gap-4">
          {[...Array(columns)].map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonGallery = ({ items = 6 }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
    ))}
  </div>
);

export const SkeletonDetail = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);