// sw.js

// Import Workbox from the CDN
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox loaded successfully.");

  // Cache GET requests to any URL that starts with "/api/"
  workbox.routing.registerRoute(
    // Match function: return true for requests to API endpoints.
    ({ url }) => url.pathname.startsWith("/api/"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 3600, // Cache expires after 1 hour
        }),
      ],
    })
  );
} else {
  console.error("Workbox failed to load.");
}
