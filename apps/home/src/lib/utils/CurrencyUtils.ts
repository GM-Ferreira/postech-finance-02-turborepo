export class CurrencyUtils {
  private constructor() {}

  /**
   * Formata um número para a moeda brasileira (BRL).
   * @param value O número a ser formatado.
   * @returns A string formatada, ex: "R$ 1.234,50".
   */
  public static formatBRL(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return (0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}
