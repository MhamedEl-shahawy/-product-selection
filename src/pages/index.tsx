import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import { Product, CartItem } from "@/types/types";
import productsData from "@/data/products.json";
import dynamic from "next/dynamic";
import FloatingCartSummary from "@/components/FloatingCartSummary";
import CategorySidebar from "@/components/CategorySidebar";
import { getCategories, getPriceRange } from "@/utils/productUtils";
import SimpleConfirmModal from "@/components/SimpleConfirmModal";

const DynamicCartModal = dynamic(() => import("@/components/CartModal"), {
  ssr: false,
});
interface HomeProps {
  initialProducts: Product[];
  initialCategories: string[];
  initialPriceRange: { min: number; max: number };
}

type SortType = "name" | "price-asc" | "price-desc";

export default function Home({
  initialProducts = [],
  initialCategories = [],
  initialPriceRange = { min: 0, max: 0 },
}: HomeProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "cartItems",
    []
  );
  const [isClient, setIsClient] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [finalOrderTotal, setFinalOrderTotal] = useState<number | null>(null);

  const [stockLevels, setStockLevels] = useLocalStorage<Record<string, number>>(
    "stockLevels",
    initialProducts?.length
      ? Object.fromEntries(initialProducts.map((p) => [p.id, p.stock]))
      : {}
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filtering and sorting states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>("name");
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>(
    initialPriceRange
  );

  useEffect(() => {
    if (initialProducts?.length) {
      const hasAllProducts = initialProducts.every(
        (product) => product.id in stockLevels
      );

      if (!hasAllProducts) {
        setStockLevels(
          Object.fromEntries(initialProducts.map((p) => [p.id, p.stock]))
        );
      }
    }
  }, [initialProducts, stockLevels, setStockLevels]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity > stockLevels[product.id]) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setStockLevels((prev) => ({
      ...prev,
      [product.id]: prev[product.id] - quantity,
    }));
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cartItems.find(
      (item) => item.product.id === productId
    );
    if (!itemToRemove) return;

    setStockLevels((prev) => ({
      ...prev,
      [productId]: prev[productId] + itemToRemove.quantity,
    }));

    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    const item = cartItems.find((item) => item.product.id === productId);
    if (!item) return;

    const quantityDiff = newQuantity - item.quantity;

    const currentStock = stockLevels[productId];
    if (currentStock - quantityDiff < 0) {
      alert("Not enough stock available");
      return;
    }

    setStockLevels((prev) => ({
      ...prev,
      [productId]: prev[productId] - quantityDiff,
    }));

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const calculateTotals = () => {
    const originalTotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let discount = 0;
    if (originalTotal > 200) {
      discount = 15;
    } else if (originalTotal > 100) {
      discount = 10;
    } else if (originalTotal > 50) {
      discount = 5;
    }

    const discountAmount = originalTotal * (discount / 100);
    const discountedTotal = originalTotal - discountAmount;

    return {
      originalTotal,
      discountedTotal,
      discount,
      discountAmount,
    };
  };

  const confirmOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const { discountedTotal } = calculateTotals();
    setFinalOrderTotal(discountedTotal);

    setCartItems([]);
    if (initialProducts?.length) {
      setStockLevels(
        Object.fromEntries(initialProducts.map((p) => [p.id, p.stock]))
      );
    }
    setIsCartOpen(false);
    setIsOrderConfirmed(true);
  };

  const { originalTotal, discountedTotal, discount } = calculateTotals();
  const productCounts = initialProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredProducts = initialProducts
    .filter((product) => {
      if (selectedCategory && product.category !== selectedCategory)
        return false;
      if (product.price < priceFilter.min || product.price > priceFilter.max)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Selection
          </h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          >
            View Cart ({cartItems.length})
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <CategorySidebar
              categories={initialCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              productCounts={productCounts}
            />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
                <div className="text-gray-600">
                  {filteredProducts.length} products
                </div>
              </div>
            </div>

            {selectedCategory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    currentStock={
                      isClient
                        ? stockLevels[product.id] ?? product.stock
                        : product.stock
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedProducts).map(([category, products]) => (
                  <div key={category}>
                    <h2 className="text-xl font-semibold mb-4">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={addToCart}
                          currentStock={
                            isClient
                              ? stockLevels[product.id] ?? product.stock
                              : product.stock
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <FloatingCartSummary
          itemCount={cartItems.length}
          originalTotal={originalTotal}
          discountedTotal={discountedTotal}
          discount={discount}
          onViewCart={() => setIsCartOpen(true)}
        />

        <SimpleConfirmModal
          isOpen={isOrderConfirmed}
          onClose={() => setIsOrderConfirmed(false)}
          finalOrderTotal={finalOrderTotal}
        />

        {isClient && (
          <DynamicCartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            originalTotal={originalTotal}
            discountedTotal={discountedTotal}
            discount={discount}
            onConfirmOrder={confirmOrder}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
          />
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = productsData.products || [];

  return {
    props: {
      initialProducts: products,
      initialCategories: getCategories(products),
      initialPriceRange: getPriceRange(products),
    },
  };
};
