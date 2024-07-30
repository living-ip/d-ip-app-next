import { setCookie } from 'cookies-next';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;
    if (token) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 14); // 14 days from now

      setCookie('x_d_jwt', token, {
        req,
        res,
        maxAge: 14 * 24 * 60 * 60, // 14 days in seconds
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });

      res.status(200).json({ message: 'Cookie set successfully' });
    } else {
      res.status(400).json({ error: 'Token is required' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
