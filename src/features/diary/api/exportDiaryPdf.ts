import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { loadDiaryRange } from "./storage";
import type { Meal } from "../model/types";
import type { Product } from "../../products/model/types";

import {
  calcForGrams,
  addNutrition,
  roundProtein,
  roundFa,
} from "../../../shared/lib/nutrition";

type Params = {
  fromISO: string;
  toISO: string;
  productsById: Map<string, Product>;
};

export async function exportDiaryPdf({ fromISO, toISO, productsById }: Params) {
  const days = await loadDiaryRange(fromISO, toISO);

  const html = buildHtml({ days, productsById, fromISO, toISO });

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const shareUri = uri;

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(shareUri, {
      mimeType: "application/pdf",
      dialogTitle: "Экспорт дневника",
    });
  }

  return shareUri;
}

function buildHtml(args: {
  days: Array<{ dateISO: string; state: { meals: Meal[] } }>;
  productsById: Map<string, Product>;
  fromISO: string;
  toISO: string;
}) {
  const { days, productsById, fromISO, toISO } = args;

  const css = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial; padding: 16px; color:#111; }
    h1 { font-size: 18px; margin: 0 0 6px 0; }
    .range { color:#555; margin-bottom: 18px; }
    .day { margin: 18px 0; padding-top: 10px; border-top: 1px solid #ddd; }
    .day-title { font-size: 16px; font-weight: 800; margin: 0 0 8px 0; }
    .meal { margin: 10px 0 14px 0; }
    .meal-title { font-size: 14px; font-weight: 700; margin: 0 0 6px 0; display:flex; justify-content:space-between; }
    table { width: 100%; border-collapse: collapse; }
    th, td { font-size: 12px; padding: 6px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
    th { text-align: left; color: #444; }
    td.num, th.num { text-align: right; width: 70px; }
    td.grams { text-align: right; width: 70px; color:#333; }
    .muted { color:#777; }
    .totals { font-weight: 700; }
    .empty { color:#777; font-size:12px; padding: 6px 0; }
  </style>
  `;

  const header = `
    <h1>Дневник питания (ФКУ)</h1>
    <div class="range">Период: ${fromISO} — ${toISO}</div>
  `;

  if (days.length === 0) {
    return `<!doctype html><html><head>${css}</head><body>${header}<div class="empty">Нет записей за выбранный период.</div></body></html>`;
  }

  const daysHtml = days
    .map(({ dateISO, state }) => {
      const meals = state.meals ?? [];

      const dayTotals = meals.reduce(
        (acc, m) => {
          for (const it of m.items) {
            const p = productsById.get(it.productId);
            if (!p) continue;

            const n = calcForGrams({
              grams: it.grams,
              proteinPer100g: p.proteinPer100g,
              faPer100g: p.faPer100g,
            });

            acc = addNutrition(acc, n);
          }
          return acc;
        },
        { proteinG: 0, faMg: 0 },
      );

      const dayProtein = roundProtein(dayTotals.proteinG);
      const dayFa = roundFa(dayTotals.faMg);

      const mealsHtml = meals
        .map((m) => {
          const mealTotals = m.items.reduce(
            (acc, it) => {
              const p = productsById.get(it.productId);
              if (!p) return acc;

              const n = calcForGrams({
                grams: it.grams,
                proteinPer100g: p.proteinPer100g,
                faPer100g: p.faPer100g,
              });

              return addNutrition(acc, n);
            },
            { proteinG: 0, faMg: 0 },
          );

          const tp = roundProtein(mealTotals.proteinG);
          const tf = roundFa(mealTotals.faMg);

          const rows =
            m.items.length === 0
              ? `<div class="empty">Пусто</div>`
              : `
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th class="grams">Грамм</th>
                    <th class="num">НБ</th>
                    <th class="num">ФА</th>
                  </tr>
                </thead>
                <tbody>
                  ${m.items
                    .map((it) => {
                      const p = productsById.get(it.productId);
                      const name = p?.name ?? "Продукт (удалён)";

                      const n = p
                        ? calcForGrams({
                            grams: it.grams,
                            proteinPer100g: p.proteinPer100g,
                            faPer100g: p.faPer100g,
                          })
                        : { proteinG: 0, faMg: 0 };

                      const protein = roundProtein(n.proteinG);
                      const fa = roundFa(n.faMg);

                      return `
                        <tr>
                          <td>${escapeHtml(name)}</td>
                          <td class="grams">${it.grams}</td>
                          <td class="num">${protein}</td>
                          <td class="num">${fa}</td>
                        </tr>
                      `;
                    })
                    .join("")}
                  <tr class="totals">
                    <td colspan="2">Итого за приём</td>
                    <td class="num">${tp}</td>
                    <td class="num">${tf}</td>
                  </tr>
                </tbody>
              </table>
            `;

          return `
            <div class="meal">
              <div class="meal-title">
                <span>${escapeHtml(m.title)}</span>
                <span class="muted">НБ ${tp} • ФА ${tf}</span>
              </div>
              ${rows}
            </div>
          `;
        })
        .join("");

      return `
        <div class="day">
          <div class="day-title">${dateISO} <span class="muted">— НБ ${dayProtein} • ФА ${dayFa}</span></div>
          ${mealsHtml}
        </div>
      `;
    })
    .join("");

  return `<!doctype html><html><head>${css}</head><body>${header}${daysHtml}</body></html>`;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
