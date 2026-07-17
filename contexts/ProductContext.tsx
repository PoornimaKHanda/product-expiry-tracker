import { isWithinNextDays } from "@/utils/date";
import { fetchAllProducts } from "@/utils/db";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  end_date: string;
  type: "expiry" | "warranty";
  attachments: string;
};

type ProductContextValue = {
  expiringSoon: Product[];
  warrantyEndingSoon: Product[];
  allProducts: Product[];
  refreshProducts: () => Promise<void>;
};

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined,
);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [expiringSoon, setExpiringSoon] = useState<Product[]>([]);
  const [warrantyEndingSoon, setWarrantyEndingSoon] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const refreshProducts = useCallback(async () => {
    const products = await fetchAllProducts();

    const expiring = products
      .filter(
        (product) =>
          product.type === "expiry" && isWithinNextDays(product.end_date, 30),
      )
      .sort(
        (a, b) =>
          new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
      );

    const warranty = products
      .filter(
        (product) =>
          product.type === "warranty" && isWithinNextDays(product.end_date, 30),
      )
      .sort(
        (a, b) =>
          new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
      );

    setExpiringSoon(expiring);
    setWarrantyEndingSoon(warranty);
    setAllProducts(products);
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return (
    <ProductContext.Provider
      value={{ expiringSoon, warrantyEndingSoon, allProducts, refreshProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductsContext must be used within a ProductProvider");
  }
  return context;
}
