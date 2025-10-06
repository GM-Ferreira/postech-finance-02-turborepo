"use client";

import { useForm, Controller } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import { zodResolver } from "@hookform/resolvers/zod";

import { transactionSelectOptions } from "@repo/api";
import { Autocomplete, Button } from "@repo/ui";

import {
  transactionSchema,
  TransactionFormData,
  TransactionFormInput,
} from "@/lib/schemas/transactionSchema";
import { useTransactionsContext } from "@/context/TransactionsContext";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/upload/ImageUpload";

const TransactionFormSkeleton = () => (
  <div className="relative z-10">
    <div className="h-9 bg-gray-200 rounded-md w-48 mb-8 animate-pulse"></div>

    <div className="space-y-6">
      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-lg max-w-96 animate-pulse"></div>
      </div>

      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-md max-w-2xs animate-pulse"></div>
      </div>

      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-md max-w-96 animate-pulse"></div>
      </div>

      <div className="pt-4">
        <div className="h-12 bg-gray-200 rounded-md w-48 animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { addTransaction, isLoading: isTransactionLoading } =
    useTransactionsContext();
  const { isLoading: isAuthLoading } = useAuth();

  const isLoading = isAuthLoading || isTransactionLoading;

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
      anexo: undefined,
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    const amountAsNumber = parseFloat(data.amount.replace(",", "."));

    try {
      await addTransaction(data.type, amountAsNumber, data.date, data.anexo);

      alert("Transação adicionada com sucesso!");
      reset();
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação. Tente novamente.");
    }
  };

  if (isLoading) {
    return <TransactionFormSkeleton />;
  }

  return (
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-gray-500 mb-8">Nova transação</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Tipo de Transação
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                value={field.value || ""}
                placeholder="Digite para buscar o tipo de transação..."
                options={transactionSelectOptions}
                className={`max-w-96 ${errors.type ? "border-warning" : ""}`}
                disabled={isLoading}
                error={!!errors.type}
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

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Comprovante (opcional)
          </label>
          <Controller
            name="anexo"
            control={control}
            render={({ field }) => (
              <ImageUpload
                onImageSelect={(base64) => field.onChange(base64 || undefined)}
                value={field.value}
                disabled={isLoading}
                className="max-w-96"
              />
            )}
          />
          {errors.anexo && (
            <p className="mt-1 text-sm text-warning">{errors.anexo.message}</p>
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
