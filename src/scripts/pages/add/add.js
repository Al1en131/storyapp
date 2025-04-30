import AddPresenter from "../../presenters/addPresenter.js";

export default class AddPage {
  constructor() {
    this.presenter = new AddPresenter(this);
  }

  async render() {
    return `
      <main id="main-content" class="main-content" tabindex="0">
        <h2>Tambah Story</h2>
        <form id="add-story-form">
            <label for="name">Nama:</label>
            <input type="text" id="name" required>

            <label for="description">Deskripsi:</label>
            <textarea id="description" rows="5" required></textarea>

            <label>Foto:</label>
            <video id="camera" autoplay></video>
            <button type="button" id="capture-btn">Ambil Foto</button>
            <canvas id="canvas" style="display:none;"></canvas>
            <img id="photo-preview" style="display:none;" alt="Preview Foto">

            <label>Lokasi:</label>
            <div id="map" style="height: 300px;"></div>
            <p id="latlon">Klik di peta untuk memilih lokasi.</p>

            <button type="submit">Tambah Story</button>
            <p id="message"></p>
        </form>
      </main>
    `;
  }

  async afterRender() {
    this.presenter.init();
  }

}

