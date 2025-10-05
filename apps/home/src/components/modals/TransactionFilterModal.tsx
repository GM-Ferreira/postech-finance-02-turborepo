"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Modal } from "@repo/ui/Modal";
import { Autocomplete } from "@repo/ui";
import { transactionSelectOptions, TransactionType } from "@repo/api";

export interface TransactionFilters {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  minValue?: number;
  maxValue?: number;
}

const filterSchema = z.object({
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface TransactionFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: TransactionFilters) => void;
  currentFilters: TransactionFilters;
}

export const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const { control, handleSubmit, reset } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      type: currentFilters.type || "",
      startDate: currentFilters.startDate || "",
      endDate: currentFilters.endDate || "",
      minValue: currentFilters.minValue?.toString() || "",
      maxValue: currentFilters.maxValue?.toString() || "",
    },
  });

  const onSubmit = (data: FilterFormData) => {
    const filters: TransactionFilters = {};

    if (data.type && data.type !== "") {
      filters.type = data.type as TransactionType;
    }
    if (data.startDate) {
      filters.startDate = data.startDate;
    }
    if (data.endDate) {
      filters.endDate = data.endDate;
    }
    if (data.minValue && data.minValue !== "") {
      filters.minValue = parseFloat(data.minValue);
    }
    if (data.maxValue && data.maxValue !== "") {
      filters.maxValue = parseFloat(data.maxValue);
    }

    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    reset({
      type: "",
      startDate: "",
      endDate: "",
      minValue: "",
      maxValue: "",
    });
    onApplyFilters({});
    onClose();
  };

  const handleClose = () => {
    reset({
      type: currentFilters.type || "",
      startDate: currentFilters.startDate || "",
      endDate: currentFilters.endDate || "",
      minValue: currentFilters.minValue?.toString() || "",
      maxValue: currentFilters.maxValue?.toString() || "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col p-6">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          Filtrar Transações
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Tipo de Transação
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={field.value || ""}
                  placeholder="Digite para buscar tipo ou deixe vazio para todos"
                  options={[
                    { value: "", label: "Todos os tipos" },
                    ...transactionSelectOptions,
                  ]}
                  className="w-full"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Data Inicial
              </label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    value={field.value || ""}
                    className="w-full rounded-md border border-gray-300 shadow-sm h-12 px-4 bg-white text-gray-700"
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Data Final
              </label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    value={field.value || ""}
                    className="w-full rounded-md border border-gray-300 shadow-sm h-12 px-4 bg-white text-gray-700"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Valor Mínimo (R$)
              </label>
              <Controller
                name="minValue"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...field}
                    value={field.value || ""}
                    className="w-full rounded-md border border-gray-300 shadow-sm h-12 px-4 bg-white text-gray-700"
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Valor Máximo (R$)
              </label>
              <Controller
                name="maxValue"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...field}
                    value={field.value || ""}
                    className="w-full rounded-md border border-gray-300 shadow-sm h-12 px-4 bg-white text-gray-700"
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 h-12 px-6 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Limpar Filtros
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-12 px-6 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-12 px-6 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
