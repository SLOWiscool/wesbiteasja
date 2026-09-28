import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ip } = req.body;
    await kv.del(`pending:${ip}`);

    return res.status(200).json({ success: true });
}
