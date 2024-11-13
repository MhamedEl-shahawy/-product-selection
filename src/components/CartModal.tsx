"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/types/types";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  originalTotal: number;
  discountedTotal: number;
  discount: number;
  onConfirmOrder: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  originalTotal,
  discountedTotal,
  discount,
  onConfirmOrder,
  onUpdateQuantity,
  onRemoveItem,
}: CartModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Cart Summary</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <div className="mt-2 sm:mt-0 flex flex-wrap gap-4 items-center">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">
                          Quantity:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            onUpdateQuantity(
                              item.product.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-20 border rounded-md px-2 py-1 text-center"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        Price: SAR {item.product.price.toFixed(2)} ×{" "}
                        {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      SAR {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-6 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>SAR {originalTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%):</span>
                <span>
                  - SAR {(originalTotal - discountedTotal).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Final Total:</span>
              <span>SAR {discountedTotal.toFixed(2)}</span>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Available discounts:</p>
              <ul className="list-disc list-inside ml-2">
                <li className={originalTotal > 50 ? "text-green-600" : ""}>
                  5% off orders above SAR 50
                </li>
                <li className={originalTotal > 100 ? "text-green-600" : ""}>
                  10% off orders above SAR 100
                </li>
                <li className={originalTotal > 200 ? "text-green-600" : ""}>
                  15% off orders above SAR 200
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onConfirmOrder}
              disabled={cartItems.length === 0}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors
                ${
                  cartItems.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
            >
              Confirm Order
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
