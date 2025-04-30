import { saveStory, getStories, deleteStory } from "../utils/indexedDB.js";

export default class StoryPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadStories() {
    const stories = await getStories();
    this.view.displayStories(stories);
  }

  async addStory(content) {
    await saveStory({ content });
    this.loadStories();

    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "NEW_STORY",
        message: "Story berhasil disimpan!",
      });
    }
  }

  async deleteStory(id) {
    await deleteStory(id);
    this.loadStories();
  }
}
