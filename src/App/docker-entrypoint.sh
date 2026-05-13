#!/bin/sh
set -e

# Inject API_URL into runtime config before nginx starts
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"
