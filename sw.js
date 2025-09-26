const CACHE_NAME = 'ai-ad-generator-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  '/icon.svg',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
  // No cacheamos los archivos de componentes/servicios porque fueron eliminados o consolidados.
  // No cacheamos env.js intencionadamente.
];

// Evento de instalación: se cachean los assets principales de la app.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Evento de activación: limpia cachés antiguas.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de fetch: decide si servir desde la red o desde la caché.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia "Network First" para el HTML principal y el archivo de entorno.
  // Esto asegura que siempre tengamos la última versión de la app y la configuración.
  if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/env.js') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si la respuesta de red es válida, la clonamos y la guardamos en caché para uso offline.
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si la red falla, intentamos servir desde la caché.
          return caches.match(request);
        })
    );
    return;
  }

  // Estrategia "Cache First" para todos los demás assets.
  // Es más rápido porque sirve directamente desde la caché si está disponible.
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Si encontramos una respuesta en caché, la devolvemos.
        if (cachedResponse) {
          return cachedResponse;
        }
        // Si no, vamos a la red.
        return fetch(request);
      })
  );
});
