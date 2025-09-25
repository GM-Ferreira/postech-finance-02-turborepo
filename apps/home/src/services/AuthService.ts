import { StorageService } from "./StorageService";

export type User = {
  name: string;
  email: string;
};
export class AuthService {
  private storageService: StorageService;
  public currentUser: User | null;

  constructor() {
    this.storageService = new StorageService();
    this.currentUser = this.storageService.getItem<User>(
      StorageService.AUTH_KEY
    );
  }

  login(user: User, setter: (user: User | null) => void): void {
    this.currentUser = user;
    this.storageService.setItem(StorageService.AUTH_KEY, user);
    setter(this.currentUser);
  }

  logout(setter: (user: User | null) => void): void {
    this.currentUser = null;
    this.storageService.removeItem(StorageService.AUTH_KEY);
    setter(this.currentUser);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
