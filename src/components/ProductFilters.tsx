interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: "price-asc" | "price-desc" | "name";
  onSortChange: (sort: "price-asc" | "price-desc" | "name") => void;
  priceRange: { min: number; max: number };
  priceFilter: { min: number; max: number };
  onPriceFilterChange: (filter: { min: number; max: number }) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  priceFilter,
  onPriceFilterChange,
}: ProductFiltersProps) {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="name">Name</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Price Range (SAR)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={priceFilter.min}
            onChange={(e) =>
              onPriceFilterChange((prev: any) => ({
                ...prev,
                min: Number(e.target.value),
              }))
            }
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Min"
            min={priceRange.min}
            max={priceRange.max}
          />
          <span>-</span>
          <input
            type="number"
            value={priceFilter.max}
            onChange={(e) =>
              onPriceFilterChange((prev: any) => ({
                ...prev,
                max: Number(e.target.value),
              }))
            }
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Max"
            min={priceRange.min}
            max={priceRange.max}
          />
        </div>
      </div>
    </div>
  );
}
