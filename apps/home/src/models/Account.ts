import {
  Transaction,
  TransactionType,
  UpdateTransactionData,
} from "./Transaction";

export class Account {
  public balance: number;
  public transactions: Transaction[];

  constructor(
    initialBalance: number = 0,
    initialTransactions: Transaction[] = []
  ) {
    this.balance = initialBalance;
    this.transactions = initialTransactions;
  }

  addTransaction(
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string
  ): void {
    const newTransaction = new Transaction(type, amount, date, description);
    this.transactions.push(newTransaction);
    this.balance += amount;
  }

  deleteTransactions(idsToDelete: string[]): void {
    if (!idsToDelete || idsToDelete.length === 0) {
      return;
    }

    const idsSet = new Set(idsToDelete);

    const amountToRevert = this.transactions
      .filter((transaction) => idsSet.has(transaction.id))
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    this.transactions = this.transactions.filter(
      (transaction) => !idsSet.has(transaction.id)
    );

    this.balance -= amountToRevert;
  }

  updateTransaction(
    transactionId: string,
    newData: UpdateTransactionData
  ): void {
    const transactionToUpdate = this.transactions.find(
      (transaction) => transaction.id === transactionId
    );

    if (!transactionToUpdate) {
      console.error(
        "Transação não encontrada para atualização:",
        transactionId
      );
      return;
    }

    const oldAmount = transactionToUpdate.amount;

    transactionToUpdate.type = newData.type;
    transactionToUpdate.amount = newData.amount;
    transactionToUpdate.date = newData.date;

    this.balance = this.balance - oldAmount + newData.amount;
  }
}
