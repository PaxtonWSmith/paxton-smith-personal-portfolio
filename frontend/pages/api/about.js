// Next.js API route for GET /api/about

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      about: "Hi, I'm Paxton. I'm a field tech and developer blending real-world experience with code."
    });
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: 'Method not allowed' });
}
