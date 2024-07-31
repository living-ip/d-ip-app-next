import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;
    if (token) {
      const maxAge = 14 * 24 * 60 * 60; // 14 days in seconds
      const cookieValue = serialize('x_d_jwt', token, {
        maxAge: maxAge,
        expires: new Date(Date.now() + maxAge * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
      });

      res.setHeader('Set-Cookie', cookieValue);
      res.status(200).json({ message: 'Cookie set successfully' });
    } else {
      res.status(400).json({ error: 'Token is required' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
