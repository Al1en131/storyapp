import RegisterPresenter from "../../presenters/registerPresenter.js";

export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Register</h1>
          <form id="register-form">
              <label for="name">Name:</label>
              <input type="text" id="name" placeholder="Name" required>

              <label for="email">Email:</label>
              <input type="email" id="email" placeholder="Email" required>

              <label for="password">Password:</label>
              <input type="password" id="password" placeholder="Password" required>

              <button type="submit">Register</button>
          </form>
          <p id="message"></p>
          <p>Already have an account? <a href="#login">Login here</a></p>
      </main>
    `;
  }

  async afterRender() {
    this.presenter.init();
  }

  displayMessage(message, isSuccess = false) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    messageElement.style.color = isSuccess ? "green" : "red";
  }

  navigateToLoginPage() {
    alert("Registration successful! Please login.");
    window.location.hash = "#login";
  }
}
