export function slugifyString(string: string): string {
  return string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/ /g, "_")
    .replace(/[^\w-]+/g, "");
}
