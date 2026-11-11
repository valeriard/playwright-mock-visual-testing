const b64url = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');

/** Structurally valid (unsigned) JWT so the frontend can decode it. */
export function fakeJwt(): string {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub: 'mock-user', role: 'user', exp })}.mock-signature`;
}
