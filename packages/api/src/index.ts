// Export types
export * from "./types";

// Export clients
export { BaseApiClient } from "./clients/BaseApiClient";
export { UserClient } from "./clients/UserClient";
export { TransactionClient } from "./clients/TransactionClient";

// Export services
export { AuthService } from "./services/AuthService";
export { TransactionService } from "./services/TransactionService";

// Import classes for default instances
import { UserClient } from "./clients/UserClient";
import { TransactionClient } from "./clients/TransactionClient";
import { AuthService } from "./services/AuthService";
import { TransactionService } from "./services/TransactionService";

// Create default instances for convenience
export const userClient = new UserClient();
export const transactionClient = new TransactionClient();
export const authService = new AuthService();
export const transactionService = new TransactionService();
