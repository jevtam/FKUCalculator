import { useEffect, useMemo, useState } from "react";
import type { Product, ProductDraft, ProductId } from "./types";
import { loadProducts, saveProducts } from "../api/storage";

function makeId(): ProductId {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function parseNumberOrNaN(s: string) {
  //запятая
  const v = Number(s.replace(",", "."));
  return v;
}

export function useProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadProducts();
      //сортировка по имени
      loaded.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      setItems(loaded);
      setIsReady(true);
    })();
  }, []);

  //автосейв на любое изменение (после загрузки)
  useEffect(() => {
    if (!isReady) return;
    saveProducts(items);
  }, [items, isReady]);

  const add = (draft: ProductDraft) => {
    const name = normalizeName(draft.name);
    const protein = parseNumberOrNaN(draft.proteinPer100g);
    const fa = parseNumberOrNaN(draft.faPer100g);

    if (!name) throw new Error("Введите название продукта");
    if (!Number.isFinite(protein) || protein < 0)
      throw new Error("Белок должен быть числом ≥ 0");
    if (!Number.isFinite(fa) || fa < 0)
      throw new Error("ФА должно быть числом ≥ 0");

    const now = Date.now();
    const p: Product = {
      id: makeId(),
      name,
      proteinPer100g: protein,
      faPer100g: fa,
      createdAt: now,
      updatedAt: now,
    };

    setItems((prev) => {
      const next = [p, ...prev];
      next.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      return next;
    });
  };

  const update = (id: ProductId, draft: ProductDraft) => {
    const name = normalizeName(draft.name);
    const protein = parseNumberOrNaN(draft.proteinPer100g);
    const fa = parseNumberOrNaN(draft.faPer100g);

    if (!name) throw new Error("Введите название продукта");
    if (!Number.isFinite(protein) || protein < 0)
      throw new Error("Белок должен быть числом ≥ 0");
    if (!Number.isFinite(fa) || fa < 0)
      throw new Error("ФА должно быть числом ≥ 0");

    const now = Date.now();

    setItems((prev) => {
      const next = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name,
              proteinPer100g: protein,
              faPer100g: fa,
              updatedAt: now,
            }
          : p,
      );
      next.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      return next;
    });
  };

  const remove = (id: ProductId) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const byId = useMemo(() => {
    const m = new Map<ProductId, Product>();
    for (const p of items) m.set(p.id, p);
    return m;
  }, [items]);

  return { isReady, items, byId, add, update, remove };
}
