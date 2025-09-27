"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SharedNavigation } from "@repo/ui";

import { useAccount } from "@/context/AccountContext";

import { useAuth } from "@/hooks/useAuth";
import { EyeIcon, EyeOffIcon, TrashIcon } from "@/components/icons";
import { TransactionDetailModal } from "@/components/modals/TransactionDetailModal";
import { Account } from "@/models/Account";
import { Transaction, transactionTypeDisplayNames } from "@/models/Transaction";
import { CurrencyUtils } from "@/lib/utils/CurrencyUtils";

type GreetinSectionProps = {
  formattedDate: string;
  weekDay: string;
  userName: string;
  account: Account | null;
  showBalance: boolean;
  setShowBalance: (value: SetStateAction<boolean>) => void;
};

const GreetingSection: React.FC<GreetinSectionProps> = ({
  account,
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
    {account ? (
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
            {showBalance
              ? CurrencyUtils.formatBRL(account.balance)
              : "R$ ******"}
          </p>
        </div>
      </div>
    ) : (
      <p>Carregando ...</p>
    )}
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
            {transaction.date.toLocaleDateString("pt-BR", { month: "long" })}
          </p>
          <p className="text-black">
            {transactionTypeDisplayNames[transaction.type]}
          </p>
          <p className="font-bold text-black">
            {CurrencyUtils.formatBRL(transaction.amount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {transaction.date.toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
};

type StatementSectionProps = {
  visibleTransactions: Transaction[] | undefined;
  account: Account | null;
  visibleCount: number;
  loadMoreTransaction: () => void;
  deleteTransactions: (idsToDelete: string[]) => void;
  onOpenTransactionDetails: (transactionId: string) => void;
};

const StatementSection: React.FC<StatementSectionProps> = ({
  visibleTransactions,
  account,
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

  const handleDeleteSelected = () => {
    const idsToDelete = Array.from(selectedIds);
    const count = idsToDelete.length;

    if (count === 0) {
      alert("Nenhuma transação selecionada para remoção.");
      return;
    }

    deleteTransactions(idsToDelete);

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
        account?.transactions &&
        visibleCount < account.transactions.length && (
          <div
            onClick={loadMoreTransaction}
            className="flex justify-center mt-4 border border-gray-300 rounded-lg py-2"
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
  const { account, showBalance, setShowBalance, deleteTransactions } =
    useAccount();

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

  const visibleTransactions = account?.transactions.slice(0, visibleCount);

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
        <GreetingSection
          formattedDate={formattedDate}
          weekDay={weekDay}
          userName={currentUser?.name ?? ""}
          account={account}
          showBalance={showBalance}
          setShowBalance={setShowBalance}
        />

        <div className="bg-zinc-300 p-6 rounded-lg flex-1 min-h-[478px]">
          {children}
        </div>
      </main>

      <StatementSection
        account={account}
        loadMoreTransaction={loadMoreTransaction}
        visibleCount={visibleCount}
        visibleTransactions={visibleTransactions}
        deleteTransactions={deleteTransactions}
        onOpenTransactionDetails={handleOpenDetails}
      />

      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetails}
        transactionId={selectedTransactionId}
      />
      {/* TODO - adicioanr footer no futuro*/}
    </div>
  );
}
