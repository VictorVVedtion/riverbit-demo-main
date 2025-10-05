export function generateReferralLink(code: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/#/?ref=${code}`;
}

export function getReferralCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  return params.get('ref');
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}