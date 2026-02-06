import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "../model/types";

const KEY = "fku.products.v1";

export async function loadProducts(): Promise<Product[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as Product[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(products));
}
