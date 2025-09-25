type NewUser = {
  name: string;
  email: string;
  password: string;
};

export class RegistrationService {
  public user: NewUser;
  public termsAccepted: boolean;

  constructor() {
    this.user = { name: "", email: "", password: "" };
    this.termsAccepted = false;
  }

  updateField(
    field: keyof NewUser,
    value: string,
    setter: (user: NewUser) => void
  ) {
    const updatedUser = { ...this.user, [field]: value };
    this.user = updatedUser;
    setter(updatedUser);
  }

  toggleTerms(setter: (value: boolean) => void) {
    this.termsAccepted = !this.termsAccepted;
    setter(this.termsAccepted);
  }

  async submit(): Promise<{ success: boolean; message?: string }> {
    if (!this.termsAccepted) {
      return Promise.reject({
        success: false,
        message: "É preciso aceitar os termos de uso.",
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isSuccess = true;

    if (isSuccess) {
      return { success: true };
    } else {
      return Promise.reject({
        success: false,
        message: "Falha ao criar a conta.",
      });
    }
  }
}
