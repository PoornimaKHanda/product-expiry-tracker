import { useAddItemForm } from '@/src/hooks';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useLayoutEffect } from 'react';

export function useAddItemScreenController() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const navigation = useNavigation();
  const form = useAddItemForm(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: form.isEdit ? 'Edit item' : 'Add item',
    });
  }, [form.isEdit, navigation]);

  return form;
}
