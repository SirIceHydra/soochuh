import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Post } from '../types/post';

const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

interface PostCardProps {
  post: Post;
  className?: string;
  showExcerpt?: boolean;
  showReadingTime?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  className = '',
  showExcerpt = true,
  showReadingTime = true,
  imageSize = 'medium',
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getImageHeight = () => {
    switch (imageSize) {
      case 'small':
        return 'h-32';
      case 'large':
        return 'h-64';
      default:
        return 'h-48';
    }
  };

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group bg-white border border-zinc-200 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${className}`}
    >
      {post.featuredImage && (
        <div className="relative overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className={`w-full ${getImageHeight()} object-cover group-hover:scale-105 transition-transform duration-500`}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-zinc-500 mb-2 text-xs font-bold uppercase tracking-widest">
          <Clock size={14} />
          <span>{formatDate(post.date)}</span>
          {showReadingTime && (
            <>
              <span className="text-zinc-300">•</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
        
        <h3 className="text-xl font-black font-display uppercase tracking-tight mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {decodeHtmlEntities(post.title)}
        </h3>
        
        {showExcerpt && (
          <p className="text-zinc-600 mb-4 line-clamp-3 flex-1">
            {decodeHtmlEntities(post.excerpt)}
          </p>
        )}
        
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        
        <span className="text-black group-hover:text-purple-600 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
};
