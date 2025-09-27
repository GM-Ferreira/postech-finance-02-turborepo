import { StorageService } from "@repo/ui";

export type User = {
  name: string;
  email: string;
};
export class AuthService {
  private storageService: StorageService;
  public currentUser: User | null;

  constructor() {
    this.storageService = new StorageService();
    this.currentUser = this.storageService.getUserData();
  }

  login(user: User, setter: (user: User | null) => void): void {
    this.currentUser = user;
    this.storageService.setUserData(user);
    setter(this.currentUser);
  }

  logout(setter: (user: User | null) => void): void {
    this.currentUser = null;
    this.storageService.clearUserData();
    setter(this.currentUser);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
