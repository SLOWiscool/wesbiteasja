const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let pendingIPs = new Map();
let approvedIPs = new Set();

app.post('/admin/verify', (req, res) => {
    const { ip } = req.body;
    const headers = req.headers;

    console.log(`[NEW REQUEST] IP: ${ip}`);
    console.log(`[HEADERS]`, JSON.stringify(headers, null, 2));

    if (approvedIPs.has(ip)) {
        return res.json({ allowed: true, redirectUrl: '/welcome' });
    }

    pendingIPs.set(ip, {
        ip,
        headers,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });

    res.json({ allowed: false, status: 'pending' });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/admin/approve', (req, res) => {
    const { ip } = req.body;
    approvedIPs.add(ip);
    if (pendingIPs.has(ip)) {
        pendingIPs.get(ip).status = 'approved';
    }
    res.json({ success: true });
});

app.post('/admin/deny', (req, res) => {
    const { ip } = req.body;
    pendingIPs.delete(ip);
    res.json({ success: true });
});

app.get('/admin/pending', (req, res) => {
    res.json(Array.from(pendingIPs.values()));
});

app.get('/welcome', (req, res) => {
    res.send('<h1>Welcome! You are verified.</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
