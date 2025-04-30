import { addStory } from "../data/api.js";

export default class AddPresenter {
  constructor(view) {
    this.view = view;
    this.selectedLat = null;
    this.selectedLon = null;
  }

  init() {
    this.setupCamera();
    this.setupMap();
    this.setupForm();
  }

  setupCamera() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const photo = document.getElementById("photo-preview");
    const captureBtn = document.getElementById("capture-btn");

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      this.cameraStream = stream;
    });

    captureBtn.addEventListener("click", () => {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      photo.src = canvas.toDataURL("image/png");
      photo.style.display = "block";

      this.stopCamera();
    });
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
    }
  }

  setupMap() {
    const map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let selectedMarker;
    map.on("click", (e) => {
      if (selectedMarker) {
        selectedMarker.remove();
      }
      selectedMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      document.getElementById(
        "latlon"
      ).innerText = `Lokasi: ${e.latlng.lat}, ${e.latlng.lng}`;
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;
    });
  }

  setupForm() {
    document
      .getElementById("add-story-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const canvas = document.getElementById("canvas");

        if (!this.selectedLat || !this.selectedLon) {
          this.view.displayMessage("Pilih lokasi di peta!");
          return;
        }

        canvas.toBlob(async (blob) => {
          const response = await addStory(
            name,
            description,
            blob,
            parseFloat(this.selectedLat),
            parseFloat(this.selectedLon)
          );

        }, "image/png");
      });
  }
}
