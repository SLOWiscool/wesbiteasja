import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const keys = await kv.keys('pending:*');
    const entries = await Promise.all(
        keys.map(async (key) => {
            const data = await kv.get(key);
            return JSON.parse(data);
        })
    );

    return res.status(200).json(entries);
}
