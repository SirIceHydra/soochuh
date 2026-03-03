import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../types/post';

interface PostDetailProps {
  post: Post;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="max-w-4xl mx-auto">
      <Link 
        to="/blog" 
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-purple-600 mb-8 font-bold uppercase tracking-widest text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {post.featuredImage && (
        <div className="mb-8">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className="w-full h-[500px] object-cover rounded-sm"
          />
        </div>
      )}

      <header className="mb-8">
        <div className="flex items-center gap-2 text-zinc-500 mb-4 text-sm font-bold uppercase tracking-widest">
          <Clock size={14} />
          <span>{formatDate(post.date)}</span>
          <span className="text-zinc-300">•</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter mb-4">
          {post.title}
        </h1>

        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </header>

      <div 
        className="prose prose-lg max-w-none text-zinc-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};
