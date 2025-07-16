const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3020; // 确保使用您服务器上未被占用的端口
const DB_PATH = path.join(__dirname, 'db.json');

// --- 安全设置 (在生产环境中，请使用环境变量!) ---
const ADMIN_USER = 'admin'; // 用户名保持不变
const ADMIN_PASS = '123456'; // !!请务必使用您设置的强密码!!

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// --- 新的认证中间件 ---
// 它会检查一个自定义的请求头，而不是触发浏览器弹窗
const checkAuth = (req, res, next) => {
    const password = req.headers['x-admin-password'];

    if (password === ADMIN_PASS) {
        next(); // 密码正确，继续
    } else {
        // 密码错误，返回401状态码和一个JSON错误信息，但不会触发浏览器弹窗
        res.status(401).json({ message: 'Authentication failed: Invalid password.' });
    }
};

// --- 公共 API：获取网站数据 (无需认证) ---
app.get('/api/data', (req, res) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading database file.');
        }
        res.json(JSON.parse(data));
    });
});

// --- 管理后台 API (使用新的认证方式) ---
// 获取管理数据 (受保护)
app.get('/api/admin/data', checkAuth, (req, res) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading file' });
        res.json(JSON.parse(data));
    });
});

// 更新数据 (受保护)
app.post('/api/admin/update', checkAuth, (req, res) => {
    const newData = req.body;
    
    // 创建一个备份，以防写入失败
    fs.copyFile(DB_PATH, `${DB_PATH}.bak`, (err) => {
        if (err) console.error('Failed to create backup:', err);
    });

    fs.writeFile(DB_PATH, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to save data.' });
        }
        res.json({ message: 'Data saved successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
