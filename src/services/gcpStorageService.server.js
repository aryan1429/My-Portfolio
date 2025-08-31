// Stub to prevent client-side bundlers from pulling server-only packages.
// Actual server implementation lives in /server/services/gcpStorageService.server.js
export default function gcpStorageStub() {
  throw new Error('Server-only GCP storage service. Import from /server/services/gcpStorageService.server.js on the server.');
}
