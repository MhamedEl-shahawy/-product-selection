interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCounts: Record<string, number>;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  productCounts,
}: CategorySidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange("")}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            selectedCategory === ""
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-50"
          }`}
        >
          All Products
          <span className="float-right text-sm text-gray-500">
            ({productCounts.all})
          </span>
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === category
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
          >
            {category}
            <span className="float-right text-sm text-gray-500">
              ({productCounts[category] || 0})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
