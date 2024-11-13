import { Product } from "@/types/types";

export const getCategories = (products: Product[]): string[] => {
  if (!products) return [];
  const categories = new Set(products.map((product) => product.category));
  return Array.from(categories).sort();
};

export const filterProductsByCategory = (
  products: Product[],
  category: string
): Product[] => {
  if (!products) return [];
  if (!category) return products;
  return products.filter((product) => product.category === category);
};

export const getPriceRange = (
  products: Product[]
): { min: number; max: number } => {
  if (!products || products.length === 0) {
    return { min: 0, max: 0 };
  }

  return products.reduce(
    (acc, product) => ({
      min: Math.min(acc.min, product.price),
      max: Math.max(acc.max, product.price),
    }),
    { min: Infinity, max: -Infinity }
  );
};
