import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { PostDetail } from '../components/PostDetail';
import { usePost } from '../hooks/usePosts';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../shop/core/cart/CartContext';

const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { post, loading, error, fetchPostBySlug } = usePost();

  useEffect(() => {
    if (slug) {
      fetchPostBySlug(slug);
    }
  }, [slug, fetchPostBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
          if (v === 'collection') navigate('/shop');
          else if (typeof v === 'string') navigate(`/${v}`);
        }} />
        <div className="pt-32 pb-20 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest">Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
          if (v === 'collection') navigate('/shop');
          else if (typeof v === 'string') navigate(`/${v}`);
        }} />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <h1 className="text-4xl font-black font-display mb-4">Post Not Found</h1>
            <p className="text-zinc-500 mb-8">{error || 'The post you are looking for does not exist.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post.seoTitle || post.title} | Soochuh</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        {post.seoKeywords && <meta name="keywords" content={post.seoKeywords.join(', ')} />}
      </Helmet>
      <Navbar cartCount={0} onOpenCart={() => {}} onNavigate={() => {}} />
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <PostDetail post={post} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostDetailPage;
