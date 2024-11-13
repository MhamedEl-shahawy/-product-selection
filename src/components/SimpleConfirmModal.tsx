interface SimpleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalOrderTotal: number | null;
}

export default function SimpleConfirmModal({
  isOpen,
  onClose,
  finalOrderTotal,
}: SimpleConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Thank you for your purchase
        </p>

        <div className="text-center mb-6">
          <span className="font-medium">Total Paid: </span>
          <span className="font-bold">
            SAR {finalOrderTotal?.toFixed(2) || "0.00"}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
