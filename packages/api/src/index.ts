// Export types
export * from './types';

// Export clients
export { BaseApiClient } from './clients/BaseApiClient';
export { UserClient } from './clients/UserClient';

// Export services
export { AuthService } from './services/AuthService';

// Import classes for default instances
import { UserClient } from './clients/UserClient';
import { AuthService } from './services/AuthService';

// Create default instances for convenience
export const userClient = new UserClient();
export const authService = new AuthService();