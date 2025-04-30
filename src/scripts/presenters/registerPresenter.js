import { register } from "../data/api.js";

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.setupForm();
  }

  setupForm() {
    document.getElementById("register-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!this.validateEmail(email)) {
        this.view.displayMessage("Email tidak valid!");
        return;
      }

      if (password.length < 6) {
        this.view.displayMessage("Password harus minimal 6 karakter!");
        return;
      }

      const result = await register(name, email, password);
      if (result) {
        this.view.displayMessage("Registrasi berhasil!", true);
        this.view.navigateToLoginPage();
      } else {
        this.view.displayMessage("Registrasi gagal! Coba lagi.");
      }
    });
  }

  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
