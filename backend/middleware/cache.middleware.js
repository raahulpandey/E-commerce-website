/**
 * Cache middleware for public GET routes.
 * Sets HTTP Cache-Control headers so browsers and CDNs cache responses.
 *
 * @param {number} seconds - Cache duration in seconds
 */
const cacheControl = (seconds) => (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=${seconds * 2}`);
  } else {
    res.set('Cache-Control', 'no-store');
  }
  next();
};

module.exports = { cacheControl };
