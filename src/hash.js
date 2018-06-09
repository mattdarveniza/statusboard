// @flow
import JsSHA from 'jssha';

export function ptvHash(url: string, apiKey: string): string {
  const sha = new JsSHA('SHA-1', 'TEXT');
  sha.setHMACKey(apiKey, 'TEXT');
  sha.update(url);
  return sha.getHMAC('HEX');
}
