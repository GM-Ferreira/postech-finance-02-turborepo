import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["Deposit", "Transfer", "Payment"], {
    message: "Por favor, selecione um tipo de transação.",
  }),
  amount: z
    .string()
    .min(1, { message: "O valor é obrigatório." })
    .refine(
      (value) => {
        const number = parseFloat(value.replace(",", "."));
        return number !== 0;
      },
      {
        message: "O valor da transação não pode ser zero.",
      }
    ),
  date: z
    .string()
    .min(1, { message: "A data é obrigatória." })
    .transform((dateStr) => new Date(`${dateStr}T00:00:00`)),
  anexo: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export type TransactionFormInput = z.input<typeof transactionSchema>;
