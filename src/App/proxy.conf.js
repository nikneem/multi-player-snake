// Reads the backend URL injected by Aspire via WithReference(api).
// Falls back to the local HTTPS launch profile when running outside Aspire.
const target =
  process.env['services__snake-api__https__0'] ||
  process.env['services__snake-api__http__0'] ||
  'https://localhost:7015';

module.exports = {
  '/health': { target, secure: false, changeOrigin: true },
  '/api': { target, secure: false, changeOrigin: true },
};
