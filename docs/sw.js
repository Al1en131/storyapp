if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + ".js", n).href),
    s[i] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, t) => {
    const r =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[r]) return;
    let o = {};
    const c = (e) => i(e, r),
      d = { module: { uri: r }, exports: o, require: c };
    s[r] = Promise.all(n.map((e) => d[e] || c(e))).then((e) => (t(...e), o));
  };
}
define(["./workbox-7e6ebd6d"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "assets/index-D7x0FuUp.js", revision: null },
        { url: "assets/index-W89KUQae.css", revision: null },
        { url: "index.html", revision: "25d0f010c568372db515d5d06b293af3" },
        { url: "registerSW.js", revision: "1872c500de691dce40960bb85481de07" },
        {
          url: "manifest.webmanifest",
          revision: "e0550f97682e3176d39c5f05e0f36903",
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))
    ),
    e.registerRoute(
      /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
      new e.StaleWhileRevalidate({
        cacheName: "api-stories-cache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif)$/,
      new e.CacheFirst({
        cacheName: "story-images-cache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    );
});
