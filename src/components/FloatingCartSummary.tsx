"use client";

interface FloatingCartSummaryProps {
  itemCount: number;
  originalTotal: number;
  discountedTotal: number;
  discount: number;
  onViewCart: () => void;
}

export default function FloatingCartSummary({
  itemCount,
  originalTotal,
  discountedTotal,
  discount,
  onViewCart,
}: FloatingCartSummaryProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden md:block">
      <div className="bg-white rounded-lg shadow-lg p-4 w-72">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items in cart:</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>SAR {originalTotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({discount}%):</span>
              <span>- SAR {(originalTotal - discountedTotal).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
            <span>Total:</span>
            <span>SAR {discountedTotal.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={onViewCart}
          className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}
