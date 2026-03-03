import React from 'react';
import { Post } from '../types/post';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const PostGrid: React.FC<PostGridProps> = ({
  posts,
  loading = false,
  error = null,
  columns = 3,
  className = '',
}) => {
  const getGridClasses = () => {
    switch (columns) {
      case 1: return 'grid grid-cols-1 gap-6';
      case 2: return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 4: return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
      default: return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  if (loading) {
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-sm mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading posts: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto text-zinc-500">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black mb-2">No posts found</h3>
          <p className="text-zinc-500">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
