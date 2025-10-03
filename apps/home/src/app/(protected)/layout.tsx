"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { SharedNavigation } from "@repo/ui";
import { Transaction, transactionTypeDisplayNames } from "@repo/api";

import { useTransactionsContext } from "@/context/TransactionsContext";

import { TransactionDetailModal } from "@/components/modals/TransactionDetailModal";
import { EyeIcon, EyeOffIcon, TrashIcon } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { CurrencyUtils } from "@/lib/utils/CurrencyUtils";

type GreetinSectionProps = {
  formattedDate: string;
  weekDay: string;
  userName: string;
  balance: number;
  showBalance: boolean;
  setShowBalance: (value: boolean) => void;
};

const GreetingSkeleton: React.FC = () => (
  <div className="bg-primary p-6 rounded-lg min-h-[655px] sm:min-h-[400px] animate-pulse">
    <div className="h-8 bg-white/20 rounded-lg w-3/4 mb-6"></div>
    <div className="h-4 bg-white/15 rounded-lg w-1/2 mb-6"></div>

    <div className="flex justify-end mt-6 pr-6">
      <div className="max-w-80 min-w-40">
        <div className="flex flex-row gap-6 items-center pb-2 mb-3 pr-9 border-b border-white/30">
          <div className="h-4 bg-white/15 rounded w-12"></div>
          <div className="w-5 h-5 bg-white/15 rounded"></div>
        </div>
        <div className="h-4 bg-white/15 rounded w-24 mb-2"></div>
        <div className="h-8 bg-white/20 rounded-lg w-32"></div>
      </div>
    </div>
  </div>
);

const StatementSkeleton: React.FC = () => (
  <aside className="w-full bg-[#f5f5f5] p-6 rounded-lg md:min-w-72 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-300 rounded w-20"></div>
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
    </div>

    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 border-b border-gray-200 py-3 px-2"
      >
        <div className="flex flex-grow justify-between items-center">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
            <div className="h-5 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="text-right">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </aside>
);

const GreetingSection: React.FC<GreetinSectionProps> = ({
  balance,
  weekDay,
  userName,
  showBalance,
  setShowBalance,
  formattedDate,
}: GreetinSectionProps) => (
  <div className="bg-primary p-6 rounded-lg min-h-[655px] sm:min-h-[400px]">
    <h1 className="text-3xl font-bold text-secondary">
      Olá, {userName} {`! :)`}
    </h1>

    <p className="mt-6  text-secondary">
      {weekDay}, {formattedDate}
    </p>
    <div className="flex justify-end mt-6 pr-6">
      <div className="max-w-80 min-w-40">
        <div className="flex flex-row gap-6 items-center pb-2 mb-3 pr-9 border-b border-white xl:border-warning">
          <p className="text-secondary">Saldo</p>
          {showBalance ? (
            <EyeIcon
              className="xl:text-warning text-white"
              onClick={() => setShowBalance(!showBalance)}
            />
          ) : (
            <EyeOffIcon
              className="xl:text-warning text-white"
              onClick={() => setShowBalance(!showBalance)}
            />
          )}
        </div>

        <p className="text-secondary">Conta corrente</p>

        <p className="text-secondary text-2xl font-light">
          {showBalance ? CurrencyUtils.formatBRL(balance) : "R$ ******"}
        </p>
      </div>
    </div>
  </div>
);

type TransactionItemProps = {
  transaction: Transaction;
  isDeleteModeActive: boolean;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
  onOpenDetails: (transactionId: string) => void;
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  isDeleteModeActive,
  isSelected,
  onSelectionChange,
  onOpenDetails,
}: TransactionItemProps) => {
  const handleClick = () => {
    if (isDeleteModeActive) {
      onSelectionChange(transaction.id);
    } else {
      onOpenDetails(transaction.id);
    }
  };

  return (
    <div
      className={`flex items-center gap-4 border-b border-success/40 py-3 px-2 cursor-pointer transition-colors
    ${isDeleteModeActive ? "hover:bg-warning/5" : "hover:bg-[#E4EDE3]/60"} `}
      onClick={handleClick}
    >
      {isDeleteModeActive && (
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="form-checkbox min-h-4 max-h-5 min-w-4 max-w-5 text-primary rounded accent-warning"
        />
      )}
      <div className="flex flex-grow justify-between items-center">
        <div>
          <p className="text-sm text-success font-semibold">
            {new Date(transaction.date).toLocaleDateString("pt-BR", {
              month: "long",
            })}
          </p>
          <p className="text-black">
            {transactionTypeDisplayNames[transaction.type] ??
              "Tipo Desconhecido"}
          </p>
          <p className="font-bold text-black">
            {CurrencyUtils.formatBRL(transaction.value)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date(transaction.date).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
};

type StatementSectionProps = {
  visibleTransactions: Transaction[];
  transactions: Transaction[];
  visibleCount: number;
  loadMoreTransaction: () => void;
  deleteTransactions: (idsToDelete: string[]) => Promise<void>;
  onOpenTransactionDetails: (transactionId: string) => void;
};

const StatementSection: React.FC<StatementSectionProps> = ({
  visibleTransactions,
  transactions,
  visibleCount,
  loadMoreTransaction,
  deleteTransactions,
  onOpenTransactionDetails,
}: StatementSectionProps) => {
  const [isDeleteModeActive, setIsDeleteModeActive] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set<string>());

  const visibleTransactionsCount = visibleTransactions?.length ?? 0;

  const isButtonActive = !isDeleteModeActive && visibleTransactionsCount > 0;
  const trashIconClass = `flex items-center justify-center rounded-full p-2 transition-colors
  ${
    isDeleteModeActive
      ? "bg-warning opacity-50 cursor-default"
      : !isButtonActive
        ? "bg-gray-400 opacity-50 cursor-default"
        : "bg-primary cursor-pointer"
  }`;

  const toggleRemoveMode = () => {
    setIsDeleteModeActive(!isDeleteModeActive);

    if (isDeleteModeActive) {
      setSelectedIds(new Set());
    }
  };

  const handleSelectionChange = (transactionId: string) => {
    const newSelectedIds = new Set(selectedIds);

    if (newSelectedIds.has(transactionId)) {
      newSelectedIds.delete(transactionId);
    } else {
      newSelectedIds.add(transactionId);
    }

    setSelectedIds(newSelectedIds);
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedIds);
    const count = idsToDelete.length;

    if (count === 0) {
      alert("Nenhuma transação selecionada para remoção.");
      return;
    }

    await deleteTransactions(idsToDelete);

    let message: string;
    if (count === 1) {
      message = "1 transação removida com sucesso!";
    } else {
      message = `${count} transações removidas com sucesso!`;
    }

    alert(message);

    toggleRemoveMode();
  };

  return (
    <aside className="w-full bg-[#f5f5f5] p-6 rounded-lg md:min-w-72">
      <div className="flex justify-between items-center mb-4">
        <p className="text-black text-xl font-bold">Extrato</p>

        <div
          onClick={isButtonActive ? toggleRemoveMode : undefined}
          className={trashIconClass}
        >
          <TrashIcon className="text-white" size={20} />
        </div>
      </div>

      {isDeleteModeActive && (
        <div className="flex flex-1 gap-2 mb-2">
          <div
            onClick={handleDeleteSelected}
            className="flex w-1/2 justify-center mt-4 border
            border-warning rounded-lg py-2 cursor-pointer hover:bg-warning/10"
          >
            <p className="text-warning">Excluir</p>
          </div>
          <div
            onClick={toggleRemoveMode}
            className="flex flex-1 justify-center mt-4 border
            border-gray-400 rounded-lg py-2 cursor-pointer  hover:bg-gray-400/10"
          >
            <p className="text-gray-600">Cancelar</p>
          </div>
        </div>
      )}

      {visibleTransactions?.map((transaction) => {
        return (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            isDeleteModeActive={isDeleteModeActive}
            isSelected={selectedIds.has(transaction.id)}
            onSelectionChange={handleSelectionChange}
            onOpenDetails={onOpenTransactionDetails}
          />
        );
      })}

      {!isDeleteModeActive &&
        transactions.length > 0 &&
        visibleCount < transactions.length && (
          <div
            onClick={loadMoreTransaction}
            className="flex justify-center mt-4 border border-gray-300 rounded-lg py-2 cursor-pointer hover:bg-gray-50"
          >
            <p className="text-success">Carregar mais itens</p>
          </div>
        )}
    </aside>
  );
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading, currentUser } = useAuth();
  const {
    transactions,
    balance,
    showBalance,
    setShowBalance,
    deleteTransactions,
    isLoading: isLoadingTransactions,
  } = useTransactionsContext();

  const [visibleCount, setVisibleCount] = useState(10);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const router = useRouter();

  const now = new Date();
  const weekDay = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const formattedDate = now.toLocaleDateString("pt-BR");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, router]);

  const visibleTransactions = useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return sortedTransactions.slice(0, visibleCount);
  }, [transactions, visibleCount]);

  const loadMoreTransaction = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleOpenDetails = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailModalOpen(false);
    setSelectedTransactionId(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto p-4 grid grid-cols-1 
      gap-6 lg:min-h-screen lg:grid-cols-[auto_1fr_auto]"
    >
      <SharedNavigation />

      <main className="flex flex-col gap-6 w-full">
        {isLoading || !currentUser ? (
          <GreetingSkeleton />
        ) : (
          <GreetingSection
            formattedDate={formattedDate}
            weekDay={weekDay}
            userName={currentUser.name}
            balance={balance}
            showBalance={showBalance}
            setShowBalance={setShowBalance}
          />
        )}

        <div className="bg-zinc-300 p-6 rounded-lg flex-1 min-h-[478px]">
          {children}
        </div>
      </main>

      {isLoadingTransactions ? (
        <StatementSkeleton />
      ) : (
        <StatementSection
          transactions={transactions}
          loadMoreTransaction={loadMoreTransaction}
          visibleCount={visibleCount}
          visibleTransactions={visibleTransactions}
          deleteTransactions={deleteTransactions}
          onOpenTransactionDetails={handleOpenDetails}
        />
      )}

      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetails}
        transactionId={selectedTransactionId}
      />
    </div>
  );
}
