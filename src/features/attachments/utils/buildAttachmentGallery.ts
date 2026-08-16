import type { Product } from '@/src/features/products/types';

export type AttachmentGalleryItem = {
  productId: number;
  productName: string;
  category: string;
  uri: string;
};

export function buildAttachmentGallery(
  products: Product[],
): AttachmentGalleryItem[] {
  const seen = new Set<string>();

  return products.reduce<AttachmentGalleryItem[]>((items, product) => {
    const attachments = product.attachments || [];

    attachments.forEach((uri) => {
      if (!uri || seen.has(uri)) {
        return;
      }

      seen.add(uri);
      items.push({
        productId: product.id,
        productName: product.name,
        category: product.category,
        uri,
      });
    });

    return items;
  }, []);
}
