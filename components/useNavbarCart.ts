import { useCart } from '../shop/core/cart/CartContext';
import { useNavigate } from 'react-router-dom';

export function useNavbarCart() {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  return {
    cartCount: cart.itemCount,
    onOpenCart: () => navigate('/cart'),
    onNavigate: (v: any) => {
      if (v === 'collection') navigate('/shop');
      else if (typeof v === 'string') {
        navigate(`/${v}`);
      }
    }
  };
}



