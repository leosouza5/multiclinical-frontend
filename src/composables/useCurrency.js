export function useCurrency() {
  const format = (value) => {
    if (value == null || value === "") return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const parse = (str) => {
    if (!str) return 0;
    return Number(
      str.replace(/\s/g, "")
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
    ) || 0;
  };

  return { format, parse };
}