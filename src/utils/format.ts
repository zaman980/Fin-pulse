export function formatCurrency(paisa: number): string {
  const value = paisa / 100;
  const formatted = Math.abs(value).toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${value < 0 ? "-" : ""}Rs ${formatted}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function dateInputToIso(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString();
}
