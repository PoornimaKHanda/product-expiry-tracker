import productRepository from "@/src/features/products/repository/productRepository";
import {
  ProductType,
  type Product as CanonicalProduct,
} from "@/src/features/products/types";
import { isWithinNextDays } from "@/src/utils/date";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ProductContextValue = {
  expiringSoon: CanonicalProduct[];
  warrantyEndingSoon: CanonicalProduct[];
  allProducts: CanonicalProduct[];
  refreshProducts: () => Promise<void>;
};

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined,
);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [expiringSoon, setExpiringSoon] = useState<CanonicalProduct[]>([]);
  const [warrantyEndingSoon, setWarrantyEndingSoon] = useState<
    CanonicalProduct[]
  >([]);
  const [allProducts, setAllProducts] = useState<CanonicalProduct[]>([]);

  const refreshProducts = useCallback(async () => {
    const products = productRepository.getAllProducts();

    const expiring = products
      .filter(
        (product) =>
          product.type === ProductType.EXPIRY &&
          isWithinNextDays(product.endDate, 30),
      )
      .sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
      );

    const warranty = products
      .filter(
        (product) =>
          product.type === ProductType.WARRANTY &&
          isWithinNextDays(product.endDate, 30),
      )
      .sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
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

export default ProductContext;
