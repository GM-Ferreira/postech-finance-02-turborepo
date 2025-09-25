export class StringUtils {
  private constructor() {}

  /**
   * Converte uma string para o formato PascalCase.
   * Lida com palavras múltiplas, espaços extras e diferentes capitalizações iniciais.
   * Ex: "hello world" -> "Hello World"
   * @param input A string a ser convertida.
   * @returns A string convertida em PascalCase.
   */
  public static toPascalCase(input: string): string {
    if (!input) {
      return "";
    }

    return input
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
