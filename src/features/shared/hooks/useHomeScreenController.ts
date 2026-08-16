import { buildAttachmentGallery } from '@/src/features/attachments/utils/buildAttachmentGallery';
import { useProductsContext } from '@/src/features/products/contexts/ProductContext';
import { ProductService } from '@/src/features/products/services/ProductService';
import type { Product as CanonicalProduct } from '@/src/features/products/types';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

export function useHomeScreenController() {
  const router = useRouter();
  const { expiringSoon, warrantyEndingSoon, allProducts, refreshProducts } =
    useProductsContext();

  const [selectedItem, setSelectedItem] = useState<CanonicalProduct | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'all' | 'gallery'>('home');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const openContextMenu = useCallback((item: CanonicalProduct) => {
    setSelectedItem(item);
    setShowContextMenu(true);
  }, []);

  const closeContextMenu = useCallback(() => setShowContextMenu(false), []);
  const cancelDelete = useCallback(() => setShowDeleteConfirm(false), []);

  const onAddNew = useCallback(() => {
    router.push('/add-item');
  }, [router]);

  const onEdit = useCallback(() => {
    if (!selectedItem) return;
    closeContextMenu();
    router.push({
      pathname: '/add-item',
      params: { id: selectedItem.id },
    });
  }, [closeContextMenu, router, selectedItem]);

  const onDelete = useCallback(() => {
    if (!selectedItem) return;
    closeContextMenu();
    setShowDeleteConfirm(true);
  }, [closeContextMenu, selectedItem]);

  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;
    cancelDelete();
    await ProductService.deleteProduct(selectedItem.id);
    setSelectedItem(null);
    refreshProducts();
  }, [cancelDelete, refreshProducts, selectedItem]);

  useFocusEffect(
    useCallback(() => {
      refreshProducts();
    }, [refreshProducts]),
  );

  const sections = useMemo(
    () => ({
      expiringSoon,
      warrantyEndingSoon,
      allProducts,
      galleryItems: buildAttachmentGallery(allProducts),
    }),
    [allProducts, expiringSoon, warrantyEndingSoon],
  );

  return {
    activeTab,
    setActiveTab,
    showContextMenu,
    setShowContextMenu,
    showDeleteConfirm,
    setShowDeleteConfirm,
    selectedItem,
    openContextMenu,
    closeContextMenu,
    cancelDelete,
    onAddNew,
    onEdit,
    onDelete,
    confirmDelete,
    refreshProducts,
    sections,
  };
}
