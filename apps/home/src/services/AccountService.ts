import { StorageService } from "@repo/ui";
import { Account } from "@/models/Account";
import {
  Transaction,
  TransactionData,
  TransactionType,
  UpdateTransactionData,
} from "@/models/Transaction";

export class AccountService {
  private storageService: StorageService;
  private static readonly ACCOUNT_KEY_PREFIX = "@bytebank/account-data";
  private userEmail: string;

  constructor(userEmail: string) {
    if (!userEmail) {
      throw new Error(
        "AccountService deve ser inicializado com um email de usuário."
      );
    }
    this.storageService = new StorageService();
    this.userEmail = userEmail;
  }

  private getAccountKey(): string {
    return `${AccountService.ACCOUNT_KEY_PREFIX}:${this.userEmail}`;
  }

  public saveAccountData(account: Account): void {
    this.storageService.setItem(this.getAccountKey(), account);
  }

  private createInitialAccount(): Account {
    const finalAccount = new Account(2500);
    finalAccount.transactions = [
      new Transaction("Payment", 2700, new Date("2025-07-20"), "Valor incial"),
      new Transaction("Transfer", -500, new Date("2025-07-21"), "Valor incial"),
      new Transaction("Deposit", 50, new Date("2025-07-21"), "Valor incial"),
      new Transaction("Deposit", 100, new Date("2025-07-21"), "Valor incial"),
      new Transaction("Deposit", 150, new Date("2025-07-22"), "Valor incial"),
    ];

    finalAccount.transactions.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    return finalAccount;
  }

  public getAccountData(): Account {
    const savedData = this.storageService.getItem<{
      balance: number;
      transactions: TransactionData[];
    }>(this.getAccountKey());

    if (savedData) {
      const transactions = savedData.transactions
        .map(
          (t) =>
            new Transaction(
              t.type,
              t.amount,
              new Date(t.date),
              t.description,
              t.id
            )
        )
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      return new Account(savedData.balance, transactions);
    }

    const initialAccount = this.createInitialAccount();
    this.saveAccountData(initialAccount);

    return initialAccount;
  }

  public addTransaction(
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string
  ): Account {
    const currentAccount = this.getAccountData();

    currentAccount.addTransaction(type, amount, date, description);

    currentAccount.transactions.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    this.saveAccountData(currentAccount);

    return currentAccount;
  }

  public deleteTransactions(idsToDelete: string[]): Account | null {
    const currentAccount = this.getAccountData();

    if (!currentAccount) {
      console.error("Nenhuma conta encontrada para deletar transações.");
      return null;
    }

    currentAccount.deleteTransactions(idsToDelete);
    this.saveAccountData(currentAccount);

    return currentAccount;
  }

  public updateTransaction(
    transactionId: string,
    newData: UpdateTransactionData
  ): Account | null {
    const currentAccount = this.getAccountData();

    if (!currentAccount) return null;

    currentAccount.updateTransaction(transactionId, newData);

    currentAccount.transactions.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    this.saveAccountData(currentAccount);
    return currentAccount;
  }
}
