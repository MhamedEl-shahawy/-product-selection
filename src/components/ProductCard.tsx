import Image from "next/image";
import { Product } from "@/types/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  currentStock: number;
}

export default function ProductCard({
  product,
  onAddToCart,
  currentStock,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No Image</span>
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1">SAR {product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1">Stock: {currentStock}</p>

        {currentStock > 0 ? (
          <div className="mt-4 flex gap-2">
            <input
              type="number"
              min="1"
              max={currentStock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              onClick={() => onAddToCart(product, quantity)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full mt-4 bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
