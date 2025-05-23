var C = (t) => {
  throw TypeError(t);
};
var S = (t, e, n) => e.has(t) || C("Cannot " + n);
var l = (t, e, n) => (
    S(t, e, "read from private field"), n ? n.call(t) : e.get(t)
  ),
  y = (t, e, n) =>
    e.has(t)
      ? C("Cannot add the same private member more than once")
      : e instanceof WeakSet
      ? e.add(t)
      : e.set(t, n),
  f = (t, e, n, r) => (
    S(t, e, "write to private field"), r ? r.call(t, n) : e.set(t, n), n
  ),
  R = (t, e, n) => (S(t, e, "access private method"), n);
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const a of s)
      if (a.type === "childList")
        for (const i of a.addedNodes)
          i.tagName === "LINK" && i.rel === "modulepreload" && r(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const a = {};
    return (
      s.integrity && (a.integrity = s.integrity),
      s.referrerPolicy && (a.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (a.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const a = n(s);
    fetch(s.href, a);
  }
})();
const v = { BASE_URL: "https://story-api.dicoding.dev/v1" };
async function K(t, e, n) {
  try {
    const r = await fetch(`${v.BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: t, email: e, password: n }),
      }),
      s = await r.json();
    if (!r.ok) throw new Error(s.message);
    return s;
  } catch (r) {
    return console.error("Error registering:", r), null;
  }
}
async function W(t, e) {
  try {
    const n = await fetch(`${v.BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: t, password: e }),
      }),
      r = await n.json();
    if (!n.ok) throw new Error(r.message);
    return localStorage.setItem("token", r.loginResult.token), r.loginResult;
  } catch (n) {
    return console.error("Error logging in:", n), null;
  }
}
async function _() {
  const t = localStorage.getItem("token");
  if (!t) return alert("Anda harus login terlebih dahulu!"), [];
  try {
    const n = await (
      await fetch(`${v.BASE_URL}/stories`, {
        method: "GET",
        headers: { Authorization: `Bearer ${t}` },
      })
    ).json();
    return n.error
      ? (console.error("Gagal mengambil data:", n.message), [])
      : n.listStory || [];
  } catch (e) {
    return console.error("Error fetching stories:", e), [];
  }
}
async function H(t, e, n, r, s) {
  const a = localStorage.getItem("token");
  if (!a) return alert("Anda harus login terlebih dahulu!"), null;
  const i = new FormData();
  i.append("description", e),
    i.append("photo", n),
    r && s && (i.append("lat", parseFloat(r)), i.append("lon", parseFloat(s)));
  try {
    return await (
      await fetch(`${v.BASE_URL}/stories`, {
        method: "POST",
        body: i,
        headers: { Authorization: `Bearer ${a}` },
      })
    ).json();
  } catch (c) {
    return console.error("Error adding story:", c), null;
  }
}
class z {
  constructor(e) {
    (this.view = e), (this.selectedLat = null), (this.selectedLon = null);
  }
  init() {
    this.setupCamera(), this.setupMap(), this.setupForm();
  }
  setupCamera() {
    const e = document.getElementById("camera"),
      n = document.getElementById("canvas"),
      r = document.getElementById("photo-preview"),
      s = document.getElementById("capture-btn");
    navigator.mediaDevices.getUserMedia({ video: !0 }).then((a) => {
      (e.srcObject = a), (this.cameraStream = a);
    }),
      s.addEventListener("click", () => {
        const a = n.getContext("2d");
        (n.width = e.videoWidth),
          (n.height = e.videoHeight),
          a.drawImage(e, 0, 0, n.width, n.height),
          (r.src = n.toDataURL("image/png")),
          (r.style.display = "block"),
          this.stopCamera();
      });
  }
  stopCamera() {
    this.cameraStream && this.cameraStream.getTracks().forEach((e) => e.stop());
  }
  setupMap() {
    const e = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(e);
    let n;
    e.on("click", (r) => {
      n && n.remove(),
        (n = L.marker([r.latlng.lat, r.latlng.lng]).addTo(e)),
        (document.getElementById(
          "latlon"
        ).innerText = `Lokasi: ${r.latlng.lat}, ${r.latlng.lng}`),
        (this.selectedLat = r.latlng.lat),
        (this.selectedLon = r.latlng.lng);
    });
  }
  setupForm() {
    document
      .getElementById("add-story-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const n = document.getElementById("name").value,
          r = document.getElementById("description").value,
          s = document.getElementById("canvas");
        if (!this.selectedLat || !this.selectedLon) {
          this.view.displayMessage("Pilih lokasi di peta!");
          return;
        }
        s.toBlob(async (a) => {
          await H(
            n,
            r,
            a,
            parseFloat(this.selectedLat),
            parseFloat(this.selectedLon)
          );
        }, "image/png");
      });
  }
}
class G {
  constructor() {
    this.presenter = new z(this);
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
class J {
  constructor(e) {
    this.view = e;
  }
  init() {
    this.setupForm();
  }
  setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const n = document.getElementById("email").value,
          r = document.getElementById("password").value;
        if (!this.validateEmail(n)) {
          this.view.displayMessage("Email tidak valid!");
          return;
        }
        const s = await W(n, r);
        s
          ? (this.view.displayMessage("Login berhasil!", !0),
            this.view.navigateToStoryPage(s.name))
          : this.view.displayMessage(
              "Login gagal! Periksa kembali email dan password."
            );
      });
  }
  validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
}
class Q {
  constructor() {
    this.presenter = new J(this);
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
  displayMessage(e, n = !1) {
    const r = document.getElementById("message");
    (r.textContent = e), (r.style.color = n ? "green" : "red");
  }
  navigateToStoryPage(e) {
    alert(`Login successful! Welcome, ${e}`), (window.location.hash = "#story");
  }
}
class Y {
  constructor(e) {
    this.view = e;
  }
  init() {
    this.setupForm();
  }
  setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const n = document.getElementById("name").value,
          r = document.getElementById("email").value,
          s = document.getElementById("password").value;
        if (!this.validateEmail(r)) {
          this.view.displayMessage("Email tidak valid!");
          return;
        }
        if (s.length < 6) {
          this.view.displayMessage("Password harus minimal 6 karakter!");
          return;
        }
        (await K(n, r, s))
          ? (this.view.displayMessage("Registrasi berhasil!", !0),
            this.view.navigateToLoginPage())
          : this.view.displayMessage("Registrasi gagal! Coba lagi.");
      });
  }
  validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
}
class X {
  constructor() {
    this.presenter = new Y(this);
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
  displayMessage(e, n = !1) {
    const r = document.getElementById("message");
    (r.textContent = e), (r.style.color = n ? "green" : "red");
  }
  navigateToLoginPage() {
    alert("Registration successful! Please login."),
      (window.location.hash = "#login");
  }
}
const I = (t, e) => e.some((n) => t instanceof n);
let x, O;
function Z() {
  return (
    x ||
    (x = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  );
}
function ee() {
  return (
    O ||
    (O = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  );
}
const P = new WeakMap(),
  k = new WeakMap(),
  E = new WeakMap();
function te(t) {
  const e = new Promise((n, r) => {
    const s = () => {
        t.removeEventListener("success", a), t.removeEventListener("error", i);
      },
      a = () => {
        n(m(t.result)), s();
      },
      i = () => {
        r(t.error), s();
      };
    t.addEventListener("success", a), t.addEventListener("error", i);
  });
  return E.set(e, t), e;
}
function ne(t) {
  if (P.has(t)) return;
  const e = new Promise((n, r) => {
    const s = () => {
        t.removeEventListener("complete", a),
          t.removeEventListener("error", i),
          t.removeEventListener("abort", i);
      },
      a = () => {
        n(), s();
      },
      i = () => {
        r(t.error || new DOMException("AbortError", "AbortError")), s();
      };
    t.addEventListener("complete", a),
      t.addEventListener("error", i),
      t.addEventListener("abort", i);
  });
  P.set(t, e);
}
let M = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === "done") return P.get(t);
      if (e === "store")
        return n.objectStoreNames[1]
          ? void 0
          : n.objectStore(n.objectStoreNames[0]);
    }
    return m(t[e]);
  },
  set(t, e, n) {
    return (t[e] = n), !0;
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store")
      ? !0
      : e in t;
  },
};
function U(t) {
  M = t(M);
}
function re(t) {
  return ee().includes(t)
    ? function (...e) {
        return t.apply(D(this), e), m(this.request);
      }
    : function (...e) {
        return m(t.apply(D(this), e));
      };
}
function se(t) {
  return typeof t == "function"
    ? re(t)
    : (t instanceof IDBTransaction && ne(t), I(t, Z()) ? new Proxy(t, M) : t);
}
function m(t) {
  if (t instanceof IDBRequest) return te(t);
  if (k.has(t)) return k.get(t);
  const e = se(t);
  return e !== t && (k.set(t, e), E.set(e, t)), e;
}
const D = (t) => E.get(t);
function ae(t, e, { blocked: n, upgrade: r, blocking: s, terminated: a } = {}) {
  const i = indexedDB.open(t, e),
    c = m(i);
  return (
    r &&
      i.addEventListener("upgradeneeded", (o) => {
        r(m(i.result), o.oldVersion, o.newVersion, m(i.transaction), o);
      }),
    n && i.addEventListener("blocked", (o) => n(o.oldVersion, o.newVersion, o)),
    c
      .then((o) => {
        a && o.addEventListener("close", () => a()),
          s &&
            o.addEventListener("versionchange", (u) =>
              s(u.oldVersion, u.newVersion, u)
            );
      })
      .catch(() => {}),
    c
  );
}
const ie = ["get", "getKey", "getAll", "getAllKeys", "count"],
  oe = ["put", "add", "delete", "clear"],
  B = new Map();
function $(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string")) return;
  if (B.get(e)) return B.get(e);
  const n = e.replace(/FromIndex$/, ""),
    r = e !== n,
    s = oe.includes(n);
  if (
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
    !(s || ie.includes(n))
  )
    return;
  const a = async function (i, ...c) {
    const o = this.transaction(i, s ? "readwrite" : "readonly");
    let u = o.store;
    return (
      r && (u = u.index(c.shift())),
      (await Promise.all([u[n](...c), s && o.done]))[0]
    );
  };
  return B.set(e, a), a;
}
U((t) => ({
  ...t,
  get: (e, n, r) => $(e, n) || t.get(e, n, r),
  has: (e, n) => !!$(e, n) || t.has(e, n),
}));
const ce = ["continue", "continuePrimaryKey", "advance"],
  F = {},
  T = new WeakMap(),
  V = new WeakMap(),
  le = {
    get(t, e) {
      if (!ce.includes(e)) return t[e];
      let n = F[e];
      return (
        n ||
          (n = F[e] =
            function (...r) {
              T.set(this, V.get(this)[e](...r));
            }),
        n
      );
    },
  };
async function* de(...t) {
  let e = this;
  if ((e instanceof IDBCursor || (e = await e.openCursor(...t)), !e)) return;
  e = e;
  const n = new Proxy(e, le);
  for (V.set(n, e), E.set(n, D(e)); e; )
    yield n, (e = await (T.get(n) || e.continue())), T.delete(n);
}
function j(t, e) {
  return (
    (e === Symbol.asyncIterator &&
      I(t, [IDBIndex, IDBObjectStore, IDBCursor])) ||
    (e === "iterate" && I(t, [IDBIndex, IDBObjectStore]))
  );
}
U((t) => ({
  ...t,
  get(e, n, r) {
    return j(e, n) ? de : t.get(e, n, r);
  },
  has(e, n) {
    return j(e, n) || t.has(e, n);
  },
}));
const ue = "story-favorite-db",
  me = 1,
  p = "stories",
  b = ae(ue, me, {
    upgrade(t) {
      t.objectStoreNames.contains(p) ||
        t.createObjectStore(p, { keyPath: "id" });
    },
  }),
  A = {
    async getStory(t) {
      return (await b).get(p, t);
    },
    async getAllStories() {
      return (await b).getAll(p);
    },
    async saveStory(t) {
      return (await b).put(p, t);
    },
    async deleteStory(t) {
      return (await b).delete(p, t);
    },
  };
class pe {
  async render() {
    return `
      <main id="main-content" class="main-content" tabindex="0">
          <h1 class="title">Saved Stories</h1>
          <section id="favorite-list" aria-live="polite"></section>
      </main>
    `;
  }
  async afterRender() {
    const e = await A.getAllStories(),
      n = document.getElementById("favorite-list");
    if (e.length === 0) {
      n.innerHTML = "<p>Belum ada story yang disimpan.</p>";
      return;
    }
    e.forEach((r) => {
      const s = document.createElement("div");
      (s.className = "story-item"),
        (s.innerHTML = `
        <img src="${r.photoUrl}" alt="Foto dari ${r.name}" class="story-image">
        <h3>${r.name}</h3>
        <p>${r.description}</p>
        <p>Created at ${r.createdAt}</p>
        <button class="unsave-story-btn" data-id="${r.id}">💔 Remove</button>
      `),
        n.appendChild(s);
    }),
      document.querySelectorAll(".unsave-story-btn").forEach((r) => {
        r.addEventListener("click", async (s) => {
          const a = s.target.dataset.id;
          await A.deleteStory(a),
            alert("Story dihapus dari favorit!"),
            this.afterRender();
        });
      });
  }
}
class he {
  constructor(e) {
    this.view = e;
  }
  async loadStories() {
    try {
      const e = await _();
      this.view.displayStories(e);
    } catch (e) {
      console.error("Gagal memuat stories:", e),
        this.view.displayStories([]),
        alert("Kamu sedang offline. Data tidak bisa dimuat.");
    }
  }
  loadMap(e) {
    const n = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(n),
      e.forEach((r) => {
        r.lat &&
          r.lon &&
          L.marker([r.lat, r.lon])
            .addTo(n)
            .bindPopup(`<b>${r.name}</b><br>${r.description}`)
            .openPopup();
      });
  }
}
class ge {
  constructor() {
    this.presenter = new he(this);
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
    this.setupEventListeners(), this.presenter.loadStories();
  }
  setupEventListeners() {
    document.getElementById("add-story-btn").addEventListener("click", () => {
      window.location.hash = "#/add";
    });
  }
  displayStories(e) {
    const n = document.getElementById("story-list");
    (n.innerHTML = ""),
      e.forEach((r) => {
        const s = document.createElement("div");
        (s.className = "story-item"),
          (s.innerHTML = `
        <img src="${r.photoUrl}" alt="Foto dari ${r.name}" class="story-image">
        <h3>${r.name}</h3>
        <p>${r.description}</p>
        <p>Created at ${r.createdAt}</p>
        <button class="save-story-btn" data-id="${r.id}">❤️ Save</button>
      `),
          n.appendChild(s);
      }),
      document.querySelectorAll(".save-story-btn").forEach((r) => {
        r.addEventListener("click", async (s) => {
          const a = s.target.dataset.id,
            i = e.find((c) => c.id === a);
          i &&
            (await A.saveStory(i),
            alert(`Story "${i.name}" disimpan ke favorit!`));
        });
      }),
      this.presenter.loadMap(e);
  }
}
const ye = {
  "/add": new G(),
  "/login": new Q(),
  "/register": new X(),
  "/": new ge(),
  "/story": new pe(),
};
function fe(t) {
  const e = t.split("/");
  return { resource: e[1] || null, id: e[2] || null };
}
function be(t) {
  let e = "";
  return (
    t.resource && (e = e.concat(`/${t.resource}`)),
    t.id && (e = e.concat("/:id")),
    e || "/"
  );
}
function we() {
  return location.hash.replace("#", "") || "/";
}
function ve() {
  const t = we(),
    e = fe(t);
  return be(e);
}
var h, g, d, w, q;
class Ee {
  constructor({ navigationDrawer: e, drawerButton: n, content: r }) {
    y(this, w);
    y(this, h, null);
    y(this, g, null);
    y(this, d, null);
    f(this, h, r), f(this, g, n), f(this, d, e), R(this, w, q).call(this);
  }
  async renderPage() {
    const e = ve(),
      n = ye[e];
    if (!document.startViewTransition) {
      (l(this, h).innerHTML = await n.render()), await n.afterRender();
      return;
    }
    document.startViewTransition(async () => {
      (l(this, h).innerHTML = await n.render()), await n.afterRender();
    });
  }
}
(h = new WeakMap()),
  (g = new WeakMap()),
  (d = new WeakMap()),
  (w = new WeakSet()),
  (q = function () {
    l(this, g).addEventListener("click", () => {
      l(this, d).classList.toggle("open");
    }),
      document.body.addEventListener("click", (e) => {
        !l(this, d).contains(e.target) &&
          !l(this, g).contains(e.target) &&
          l(this, d).classList.remove("open"),
          l(this, d)
            .querySelectorAll("a")
            .forEach((n) => {
              n.contains(e.target) && l(this, d).classList.remove("open");
            });
      });
  });
async function Se(t) {
  const e = localStorage.getItem("token");
  if (!e) {
    console.error("Token tidak ditemukan saat subscribe.");
    return;
  }
  const r = await (
    await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${e}`,
      },
      body: JSON.stringify({
        endpoint: t.endpoint,
        keys: {
          p256dh: t.getKey("p256dh")
            ? btoa(String.fromCharCode(...new Uint8Array(t.getKey("p256dh"))))
            : null,
          auth: t.getKey("auth")
            ? btoa(String.fromCharCode(...new Uint8Array(t.getKey("auth"))))
            : null,
        },
      }),
    })
  ).json();
  console.log("Response dari server saat subscribe:", r);
}
async function Le(t) {
  const e = localStorage.getItem("token");
  if (!e) {
    console.error("Token tidak ditemukan saat unsubscribe.");
    return;
  }
  const r = await (
    await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${e}`,
      },
      body: JSON.stringify({ endpoint: t }),
    })
  ).json();
  console.log("Response dari server saat unsubscribe:", r);
}
async function N(t) {
  console.log("SetupPushButtons called", t);
  const e = document.getElementById("subscribe-btn"),
    n = document.getElementById("unsubscribe-btn");
  if (!localStorage.getItem("token")) {
    console.warn("Token tidak ditemukan, tombol notifikasi tidak akan aktif."),
      (e.disabled = !0),
      (n.disabled = !0);
    return;
  }
  if (!e || !n) {
    console.warn("Tombol subscribe/unsubscribe tidak ditemukan di DOM.");
    return;
  }
  (await t.pushManager.getSubscription())
    ? ((e.style.display = "none"), (n.style.display = "inline-block"))
    : ((e.style.display = "inline-block"), (n.style.display = "none")),
    (e.onclick = async () => {
      if ((await Notification.requestPermission()) !== "granted") {
        alert("Izin notifikasi ditolak");
        return;
      }
      try {
        const i = await t.pushManager.subscribe({
          userVisibleOnly: !0,
          applicationServerKey:
            "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",
        });
        console.log("Berhasil subscribe:", i),
          await Se(i),
          (e.style.display = "none"),
          (n.style.display = "inline-block");
      } catch (i) {
        console.error("Gagal subscribe:", i);
      }
    }),
    (n.onclick = async () => {
      const a = await t.pushManager.getSubscription();
      a &&
        (await a.unsubscribe(),
        console.log("Berhasil unsubscribe"),
        await Le(a.endpoint),
        (e.style.display = "inline-block"),
        (n.style.display = "none"));
    });
}
document.addEventListener("DOMContentLoaded", async () => {
  const t = new Ee({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await t.renderPage(),
    console.log("Subscribe button:", document.getElementById("subscribe-btn")),
    console.log(
      "Unsubscribe button:",
      document.getElementById("unsubscribe-btn")
    );
  let e;
  if ("serviceWorker" in navigator && "PushManager" in window)
    try {
      (e = await navigator.serviceWorker.register("sw.js")),
        console.log("Service Worker terdaftar:", e),
        await N(e);
    } catch (n) {
      console.error("Service Worker gagal terdaftar:", n);
    }
  window.addEventListener("hashchange", async () => {
    await t.renderPage(), e && (await N(e));
  });
});
