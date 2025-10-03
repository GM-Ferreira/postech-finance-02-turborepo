"use client";

import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTransactionsContext } from "@/context/TransactionsContext";

import { Modal } from "@repo/ui/Modal";
import { Select } from "@repo/ui/Select";

import { PencilIcon, TrashIcon } from "@/components/icons";
import { CurrencyUtils } from "@/lib/utils/CurrencyUtils";
import {
  TransactionFormData,
  TransactionFormInput,
  transactionSchema,
} from "@/lib/schemas/transactionSchema";
import {
  transactionSelectOptions,
  transactionTypeDisplayNames,
} from "@repo/api";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="text-left w-full mb-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-black font-semibold text-lg">{value || "-"}</p>
  </div>
);

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}: TransactionDetailModalProps) => {
  const { transactions, editTransaction, deleteTransactions } =
    useTransactionsContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transaction = transactions.find((tx) => tx.id === transactionId);

  const {
    control,
    handleSubmit,
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

  useEffect(() => {
    if (isEditing && transaction) {
      const amountAsString = String(transaction.value).replace(".", ",");

      const dateForInput = new Date(transaction.date)
        .toISOString()
        .split("T")[0];

      reset({
        type: transaction.type,
        amount: amountAsString,
        date: dateForInput,
      });
    }
  }, [isEditing, transaction, reset]);

  if (!transaction) {
    return null;
  }

  const onEditSubmit = async (data: TransactionFormData) => {
    if (transactionId && !isSubmitting) {
      setIsSubmitting(true);

      try {
        const amountAsNumber = parseFloat(data.amount.replace(",", "."));
        const dateAsDate = new Date(data.date);

        await editTransaction(transactionId, {
          type: data.type,
          value: amountAsNumber,
          date: dateAsDate,
        });

        alert("Transação atualizada com sucesso!");
        setIsEditing(false);
      } catch (error) {
        alert("Erro ao atualizar transação: " + error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleDelete = async () => {
    if (transactionId && !isSubmitting) {
      setIsSubmitting(true);

      try {
        await deleteTransactions([transactionId]);
        alert("Transação excluída com sucesso!");
        handleClose();
      } catch (error) {
        alert("Erro ao excluir transação: " + error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative flex flex-col items-center text-center p-4 sm:p-6">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-primary font-medium">Processando...</p>
            </div>
          </div>
        )}
        {isEditing ? (
          <>
            <h2 className="text-2xl font-bold text-black mb-6">
              Editar Transação
            </h2>
            <form
              onSubmit={handleSubmit(onEditSubmit)}
              className="w-full max-w-sm space-y-6 text-left"
            >
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Tipo de Transação
                </label>

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
                    />
                  )}
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-warning">
                    {errors.type.message}
                  </p>
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
                  <p className="mt-1 text-sm text-warning">
                    {errors.amount.message}
                  </p>
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
                      type="date"
                      {...field}
                      value={field.value || ""}
                      className={`mt-1 block w-full rounded-md border
                      shadow-sm h-12 px-4 bg-white text-zinc-500 
                      ${errors.date ? "border-warning" : "border-primary"}`}
                    />
                  )}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-warning">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <DetailRow label="Descrição" value={transaction.description} />

              <DetailRow label="#ID" value={transaction.id} />

              <div className="mt-8 flex gap-4 w-full justify-center">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                  className="h-12 px-6 rounded-md bg-warning hover:opacity-100 opacity-80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-6 rounded-md bg-success hover:opacity-100 opacity-80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-black mb-6">
              Detalhes da Transação
            </h2>

            <div className="w-full max-w-sm">
              <DetailRow
                label="Tipo de Transação"
                value={transactionTypeDisplayNames[transaction.type]}
              />

              <DetailRow
                label="Valor"
                value={CurrencyUtils.formatBRL(transaction.value)}
              />

              <DetailRow
                label="Data"
                value={new Date(transaction.date).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              />

              <DetailRow label="Descrição" value={transaction.description} />

              <DetailRow label="#ID" value={transaction.id} />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-6 opacity-80 
                rounded-md bg-warning text-white hover:opacity-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon size={18} />
                {isSubmitting ? "Excluindo..." : "Excluir"}
              </button>

              <button
                onClick={() => setIsEditing(true)}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-6 opacity-80 
                 rounded-md bg-primary text-white hover:opacity-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PencilIcon size={18} />
                Editar
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
