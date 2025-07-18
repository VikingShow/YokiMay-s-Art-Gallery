// 引入 dotenv 来管理环境变量
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer'); // 引入 multer

const app = express();
const PORT = process.env.PORT || 3000; // 确保使用您服务器上未被占用的端口
const DB_PATH = path.join(__dirname, 'db.json');

// --- 安全设置 ---
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin'; // !!请务必使用您设置的强密码!!

// --- 图片上传设置 ---
const UPLOADS_DIR = path.join(__dirname, '../frontend/uploads');

// 确保上传目录存在
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // 创建一个唯一的文件名，避免重名覆盖
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// --- 【关键修正】确保 upload 变量在这里被定义 ---
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
// 让 'uploads' 目录下的文件可以通过URL直接访问
// 注意：这里的路径是相对于项目根目录的URL路径，而不是服务器上的文件系统路径
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));


// --- 认证中间件 ---
const checkAuth = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    if (password === ADMIN_PASS) {
        next();
    } else {
        res.status(401).json({ message: 'Authentication failed: Invalid password.' });
    }
};

// --- 公共 API (无需认证) ---
app.get('/api/data', (req, res) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading database file.');
        res.json(JSON.parse(data));
    });
});

// --- 管理后台 API ---
app.get('/api/admin/data', checkAuth, (req, res) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading file' });
        res.json(JSON.parse(data));
    });
});

app.post('/api/admin/update', checkAuth, (req, res) => {
    const newData = req.body;
    fs.copyFile(DB_PATH, `${DB_PATH}.bak`, (err) => {
        if (err) console.error('Failed to create backup:', err);
    });
    fs.writeFile(DB_PATH, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).json({ message: 'Failed to save data.' });
        res.json({ message: 'Data saved successfully!' });
    });
});

// --- 图片上传 API (受保护) ---
// 现在这里的 'upload' 变量是已定义的
app.post('/api/admin/upload', checkAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    // 返回可公开访问的图片URL
    res.json({ url: `/uploads/${req.file.filename}` });
});


app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
