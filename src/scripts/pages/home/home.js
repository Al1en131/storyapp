import StoryPresenter from "../../presenters/homePresenter.js";
import FavoriteStoryDB from "../../utils/indexedDB.js";

export default class HomePage {
  constructor() {
    this.presenter = new StoryPresenter(this);
  }

  async render() {
    return `
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Daftar Story</h1>
          <button id="add-story-btn">+ Add Story</button>
          <section id="story-list" aria-live="polite"></section>
          <section id="map-container">
              <h2>Peta Lokasi</h2>
              <div id="map" style="height: 300px;"></div>
          </section>
      </main>
    `;
  }

  async afterRender() {
    this.setupEventListeners();
    this.presenter.loadStories();
  }

  setupEventListeners() {
    document.getElementById("add-story-btn").addEventListener("click", () => {
      window.location.hash = "#/add";
    });
  }

  displayStories(stories) {
    const listContainer = document.getElementById("story-list");
    listContainer.innerHTML = "";

    stories.forEach((story) => {
      const item = document.createElement("div");
      item.className = "story-item";
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="story-image">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p>Created at ${story.createdAt}</p>
        <button class="save-story-btn" data-id="${story.id}">❤️ Save</button>
      `;
      listContainer.appendChild(item);
    });

    document.querySelectorAll(".save-story-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const storyId = e.target.dataset.id;
        const storyToSave = stories.find((s) => s.id === storyId);
        if (storyToSave) {
          await FavoriteStoryDB.saveStory(storyToSave);
          alert(`Story "${storyToSave.name}" disimpan ke favorit!`);
        }
      });
    });

    this.presenter.loadMap(stories);
  }
}
