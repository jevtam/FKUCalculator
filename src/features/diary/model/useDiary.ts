import { useDiaryByDate } from "./useDiaryByDate";

function todayISO(): string {
  const d = new Date();
  //YYYY-MM-DD в локальном времени
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useDiary() {
  return useDiaryByDate(todayISO());
}
