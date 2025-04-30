import FavoriteStoryDB from "../../utils/indexedDB.js";

export default class StoryPage {
  async render() {
    return `
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Saved Stories</h1>
          <section id="favorite-list" aria-live="polite"></section>
      </main>
    `;
  }

  async afterRender() {
    const favoriteStories = await FavoriteStoryDB.getAllStories();
    const listContainer = document.getElementById("favorite-list");

    if (favoriteStories.length === 0) {
      listContainer.innerHTML = "<p>Belum ada story yang disimpan.</p>";
      return;
    }

    favoriteStories.forEach((story) => {
      const item = document.createElement("div");
      item.className = "story-item";
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="story-image">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p>Created at ${story.createdAt}</p>
        <button class="unsave-story-btn" data-id="${story.id}">💔 Remove</button>
      `;
      listContainer.appendChild(item);
    });

    document.querySelectorAll(".unsave-story-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await FavoriteStoryDB.deleteStory(id);
        alert("Story dihapus dari favorit!");
        this.afterRender(); // Refresh list
      });
    });
  }
}
