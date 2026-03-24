export function getBearerTokenFromRequest(request: Request): string {
  const authorization = request.headers.get('authorization');
  if (!authorization) return '';

  const [scheme, token] = authorization.split(' ');
  if (!scheme || !token) return '';
  if (scheme.toLowerCase() !== 'bearer') return '';

  return token;
}
