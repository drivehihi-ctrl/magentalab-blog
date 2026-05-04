"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: any;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();

  const handleAddToCart = () => {
    try {
      const savedCart = localStorage.getItem("magenta_cart");
      let cart = [];
      if (savedCart) {
        cart = JSON.parse(savedCart);
      }
      
      // ShopClient와 동일한 데이터 구조 맞추기
      const cartItem = {
        ...product,
        image: product.image_url || product.image,
        price: Number(product.price),
        originalPrice: Number(product.original_price || product.originalPrice || 0)
      };

      cart.push(cartItem);
      localStorage.setItem("magenta_cart", JSON.stringify(cart));
      
      alert(`${product.name} 상품이 장바구니에 담겼습니다! 🐾`);
      router.push("/shop?tab=cart");
    } catch (error) {
      console.error("Cart error:", error);
      alert("장바구니 담기 중 오류가 발생했습니다.");
    }
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="flex-none w-14 h-14 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-magenta transition-colors"
    >
      <ShoppingCart className="w-6 h-6" />
    </button>
  );
}
