import { login } from "../data/api.js";

export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.setupForm();
  }

  setupForm() {
    document.getElementById("login-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!this.validateEmail(email)) {
        this.view.displayMessage("Email tidak valid!");
        return;
      }

      const result = await login(email, password);
      if (result) {
        this.view.displayMessage("Login berhasil!", true);
        this.view.navigateToStoryPage(result.name);
      } else {
        this.view.displayMessage("Login gagal! Periksa kembali email dan password.");
      }
    });
  }

  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
