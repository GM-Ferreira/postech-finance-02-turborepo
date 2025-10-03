"use client";

import { useForm, Controller } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import { zodResolver } from "@hookform/resolvers/zod";

import { transactionSelectOptions } from "@repo/api";
import { Select, Button } from "@repo/ui";

import {
  transactionSchema,
  TransactionFormData,
  TransactionFormInput,
} from "@/lib/schemas/transactionSchema";
import { useTransactionsContext } from "@/context/TransactionsContext";

export default function Home() {
  const { addTransaction, isLoading } = useTransactionsContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TransactionFormInput, undefined, TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    mode: "onSubmit",
    defaultValues: {
      type: undefined,
      amount: "",
      date: "",
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    const amountAsNumber = parseFloat(data.amount.replace(",", "."));

    try {
      await addTransaction(data.type, amountAsNumber, data.date);

      alert("Transação adicionada com sucesso!");
      reset();
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação. Tente novamente.");
    }
  };

  return (
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-gray-500 mb-8">Nova transação</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || ""}
                placeholder="Selecione o tipo de transação"
                options={transactionSelectOptions}
                className={`max-w-96 ${errors.type && "border-warning"}`}
                disabled={isLoading}
              />
            )}
          />
          {errors.type && (
            <p className="mt-1 text-sm text-warning">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Valor
          </label>

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="amount"
                name={field.name}
                disabled={isLoading}
                value={field.value}
                ref={field.ref}
                onBlur={field.onBlur}
                placeholder="R$ 0,00"
                allowDecimals
                decimalsLimit={2}
                decimalSeparator=","
                groupSeparator="."
                prefix="R$ "
                onValueChange={(value) =>
                  field.onChange(value === undefined ? "" : value)
                }
                className={`mt-1 block w-full max-w-2xs rounded-md border
                  shadow-sm h-12 px-4 bg-white text-zinc-500 
                  ${errors.amount ? "border-warning" : "border-primary"}`}
              />
            )}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-warning">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Data da Transação
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <input
                id="date"
                type="date"
                disabled={isLoading}
                {...field}
                className={`mt-1 block w-full max-w-96 rounded-md border 
                  shadow-sm h-12 px-4 bg-white text-zinc-500 
                  ${errors.date ? "border-warning" : "border-primary"}`}
              />
            )}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-warning">{errors.date.message}</p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Carregando..." : "Adicionar transação"}
          </Button>
        </div>
      </form>
    </div>
  );
}
