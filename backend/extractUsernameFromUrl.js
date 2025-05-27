// Ekstrak username dari url tweet (twitter.com atau x.com)
export function extractUsernameFromUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:twitter|x)\.com\/([^\/]+)\//);
  return match ? match[1] : null;
}
