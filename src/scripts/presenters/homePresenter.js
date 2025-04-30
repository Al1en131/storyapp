import { getStories } from "../data/api.js";

export default class StoryPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadStories() {
    try {
      const stories = await getStories();
      this.view.displayStories(stories);
    } catch (error) {
      console.error("Gagal memuat stories:", error);
      this.view.displayStories([]);
      alert("Kamu sedang offline. Data tidak bisa dimuat.");
    }
  }
  

  loadMap(stories) {
    const map = L.map("map").setView([-2.5489, 118.0149], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker
          .bindPopup(`<b>${story.name}</b><br>${story.description}`)
          .openPopup();
      }
    });
  }
}
