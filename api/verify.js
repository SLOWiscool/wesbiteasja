const db = {
    approvedIPs: [],
    redirectUrl: "/welcome"
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ip, headers } = req.body;

    console.log(`[VERIFY] IP: ${ip}`);
    console.log(`[VERIFY] Headers:`, JSON.stringify(headers));
    console.log(`[VERIFY] Approved list:`, db.approvedIPs);

    const isApproved = db.approvedIPs.includes(ip);
    console.log(`[VERIFY] Result: ${isApproved ? 'ALLOWED' : 'DENIED'}`);

    if (isApproved) {
        return res.status(200).json({ allowed: true, redirectUrl: db.redirectUrl });
    }

    return res.status(200).json({ allowed: false });
}
