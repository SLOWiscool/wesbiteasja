import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ip, headers } = req.body;

    const dbPath = path.join(process.cwd(), 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const isApproved = db.approvedIPs.includes(ip);

    if (isApproved) {
        return res.status(200).json({ allowed: true, redirectUrl: db.redirectUrl || '/welcome' });
    }

    return res.status(200).json({ allowed: false });
}
