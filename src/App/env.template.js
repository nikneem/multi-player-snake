// Docker entrypoint runs: envsubst < env.template.js > /usr/share/nginx/html/env.js
// API_URL env var must be set to the full backend URL (e.g. https://snake-api.region.azurecontainerapps.io)
(window).__env = { apiUrl: '${API_URL}' };
