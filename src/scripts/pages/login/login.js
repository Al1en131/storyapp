import LoginPresenter from "../../presenters/loginPresenter.js";

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter(this);
  }

  async render() {
    return `
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Login</h1>
          <form id="login-form">
              <label for="email">Email:</label>
              <input type="email" id="email" placeholder="Email" required>

              <label for="password">Password:</label>
              <input type="password" id="password" placeholder="Password" required>

              <button type="submit">Login</button>
          </form>
          <p id="message"></p>
          <p>Don't have an account? <a href="#register">Register here</a></p>
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

  navigateToStoryPage(userName) {
    alert(`Login successful! Welcome, ${userName}`);
    window.location.hash = "#story";
  }
}
