const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const app = express();

// 启用CORS
app.use(cors());
// 解析JSON请求体
app.use(express.json());

// 城市数据
const cities = [
    // 直辖市
    '北京', '上海', '天津', '重庆',
    
    // 河北省
    '石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水',
    
    // 山西省
    '太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁',
    
    // 辽宁省
    '沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛',
    
    // 吉林省
    '长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边',
    
    // 黑龙江省
    '哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭',
    
    // 江苏省
    '南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁',
    
    // 浙江省
    '杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水',
    
    // 安徽省
    '合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城',
    
    // 福建省
    '福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德',
    
    // 江西省
    '南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶',
    
    // 山东省
    '济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽',
    
    // 河南省
    '郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店',
    
    // 湖北省
    '武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施', '仙桃', '潜江', '天门',
    
    // 湖南省
    '长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西',
    
    // 广东省
    '广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮',
    
    // 广西壮族自治区
    '南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左',
    
    // 海南省
    '海口', '三亚', '三沙', '儋州',
    
    // 四川省
    '成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山',
    
    // 贵州省
    '贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南',
    
    // 云南省
    '昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆',
    
    // 西藏自治区
    '拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里',
    
    // 陕西省
    '西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛',
    
    // 甘肃省
    '兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏', '甘南',
    
    // 青海省
    '西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西',
    
    // 宁夏回族自治区
    '银川', '石嘴山', '吴忠', '固原', '中卫',
    
    // 新疆维吾尔自治区
    '乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '阿克苏', '喀什', '和田', '昌吉', '博尔塔拉', '巴音郭楞', '克孜勒苏', '伊犁', '塔城', '阿勒泰', '石河子', '阿拉尔', '图木舒克', '五家渠', '北屯', '铁门关', '双河', '可克达拉', '昆玉',
    
    // 台湾省
    '台北', '高雄', '台南', '台中', '桃园', '新竹', '嘉义',
    
    // 香港特别行政区
    '香港',
    
    // 澳门特别行政区
    '澳门'
];

// 数据库连接配置
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'hotel_search'
};

// 内存存储作为回退
let users = [];
let sessions = [];
let searchHistory = {};
let favorites = {};

// 数据库连接状态
let dbConnected = false;

// 生成会话ID
function generateSessionId() {
    return Math.random().toString(36).substr(2, 9);
}

// 切换到内存存储
function useMemoryStorage() {
    dbConnected = false;
    console.log('切换到内存存储模式');
}

// 初始化数据库
async function initDatabase() {
    try {
        // 创建数据库连接
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        
        // 创建数据库
        await connection.execute('CREATE DATABASE IF NOT EXISTS hotel_search');
        console.log('数据库创建成功');
        
        // 使用数据库
        await connection.query('USE hotel_search');
        
        // 创建用户表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('用户表创建成功');
        
        // 创建会话表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(50) UNIQUE NOT NULL,
                username VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
            )
        `);
        console.log('会话表创建成功');
        
        // 创建搜索历史表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS search_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                destination VARCHAR(100) NOT NULL,
                check_in DATE NOT NULL,
                check_out DATE NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
            )
        `);
        console.log('搜索历史表创建成功');
        
        // 创建收藏酒店表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                hotel_id VARCHAR(50) NOT NULL,
                hotel_name VARCHAR(100) NOT NULL,
                hotel_address VARCHAR(200) NOT NULL,
                hotel_price INT NOT NULL,
                hotel_image VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_hotel (username, hotel_id),
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
            )
        `);
        console.log('收藏酒店表创建成功');
        
        // 关闭连接
        await connection.end();
        dbConnected = true;
        console.log('数据库初始化完成');
        console.log('数据库连接成功，使用MySQL存储数据');

    } catch (error) {
        console.error('数据库初始化错误:', error);
        console.error('警告: 数据库连接失败，用户认证、搜索历史和收藏酒店功能将不可用');
    }
}

// 初始化数据库
initDatabase();

// 搜索联想API
app.get('/api/suggestions', (req, res) => {
    const query = req.query.query || '';
    if (!query) {
        return res.json([]);
    }
    
    // 过滤匹配的城市
    const suggestions = cities.filter(city => 
        city.includes(query)
    );
    
    res.json(suggestions);
});

// 注册API
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.json({ success: false, message: '用户名和密码不能为空' });
        }
        
        // 尝试使用数据库存储
        if (dbConnected) {
            console.log('使用数据库存储进行注册');
            try {
                // 创建数据库连接
                console.log('创建数据库连接');
                const connection = await mysql.createConnection(dbConfig);
                console.log('数据库连接成功');
                
                // 检查用户名是否已存在
                console.log('检查用户名是否已存在:', username);
                const [existingUsers] = await connection.execute(
                    'SELECT * FROM users WHERE username = ?',
                    [username]
                );
                console.log('检查结果:', existingUsers.length);
                
                if (existingUsers.length > 0) {
                    await connection.end();
                    return res.json({ success: false, message: '用户名已存在' });
                }
                
                // 创建新用户
                console.log('创建新用户:', username);
                await connection.execute(
                    'INSERT INTO users (username, password) VALUES (?, ?)',
                    [username, password]
                );
                console.log('用户创建成功');
                
                // 创建会话
                const sessionId = generateSessionId();
                console.log('创建会话:', sessionId);
                await connection.execute(
                    'INSERT INTO sessions (session_id, username) VALUES (?, ?)',
                    [sessionId, username]
                );
                console.log('会话创建成功');
                
                // 关闭连接
                await connection.end();
                console.log('数据库连接关闭');
                
                return res.json({ success: true, username, sessionId });
            } catch (error) {
                console.error('注册错误:', error);
                // 数据库失败，使用内存存储作为回退
                console.log('数据库注册失败，使用内存存储作为回退');
                useMemoryStorage();
                // 继续执行内存存储的代码
            }
        }
        
        // 使用内存存储
        console.log('使用内存存储进行注册');
        // 检查用户名是否已存在
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.json({ success: false, message: '用户名已存在' });
        }
        
        // 创建新用户
        const newUser = { username, password };
        users.push(newUser);
        console.log('内存存储用户创建成功:', username);
        
        // 创建会话
        const sessionId = generateSessionId();
        sessions.push({ sessionId, username });
        console.log('内存存储会话创建成功:', sessionId);
        
        // 初始化搜索历史和收藏
        searchHistory[username] = [];
        favorites[username] = [];
        
        return res.json({ success: true, username, sessionId });
    } catch (error) {
        console.error('注册API错误:', error);
        return res.json({ success: false, message: '注册失败，请稍后重试' });
    }
});

// 登录API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, message: '用户名和密码不能为空' });
    }
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            // 验证用户
            const [users] = await connection.execute(
                'SELECT * FROM users WHERE username = ? AND password = ?',
                [username, password]
            );
            
            if (users.length === 0) {
                await connection.end();
                return res.json({ success: false, message: '用户名或密码错误' });
            }
            
            // 创建会话
            const sessionId = generateSessionId();
            await connection.execute(
                'INSERT INTO sessions (session_id, username) VALUES (?, ?)',
                [sessionId, username]
            );
            
            // 关闭连接
            await connection.end();
            
            res.json({ success: true, username, sessionId });
        } catch (error) {
            console.error('登录错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库登录失败，使用内存存储作为回退');
            useMemoryStorage();
        }
    }
    
    // 使用内存存储
    // 验证用户
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    // 创建会话
    const sessionId = generateSessionId();
    sessions.push({ sessionId, username });
    
    res.json({ success: true, username, sessionId });
});

// 退出登录API
app.post('/api/logout', async (req, res) => {
    const sessionId = req.headers['authorization'];
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            if (sessionId) {
                await connection.execute(
                    'DELETE FROM sessions WHERE session_id = ?',
                    [sessionId]
                );
            }
            
            // 关闭连接
            await connection.end();
            
            res.json({ success: true });
        } catch (error) {
            console.error('退出登录错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库退出登录失败，使用内存存储作为回退');
            useMemoryStorage();
        }
    }
    
    // 使用内存存储
    if (sessionId) {
        sessions = sessions.filter(session => session.sessionId !== sessionId);
    }
    
    res.json({ success: true });
});

// 检查登录状态API
app.get('/api/check-login', async (req, res) => {
    const sessionId = req.headers['authorization'];
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            if (sessionId) {
                const [sessions] = await connection.execute(
                    'SELECT * FROM sessions WHERE session_id = ?',
                    [sessionId]
                );
                
                if (sessions.length > 0) {
                    await connection.end();
                    return res.json({ loggedIn: true, username: sessions[0].username });
                }
            }
            
            // 关闭连接
            await connection.end();
            
            res.json({ loggedIn: false });
        } catch (error) {
            console.error('检查登录状态错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库检查登录状态失败，使用内存存储作为回退');
            useMemoryStorage();
            // 使用内存存储
            if (sessionId) {
                const session = sessions.find(s => s.sessionId === sessionId);
                if (session) {
                    return res.json({ loggedIn: true, username: session.username });
                }
            }
            return res.json({ loggedIn: false });
        }
    }
    
    // 使用内存存储
    if (sessionId) {
        const session = sessions.find(session => session.sessionId === sessionId);
        if (session) {
            return res.json({ loggedIn: true, username: session.username });
        }
    }
    
    res.json({ loggedIn: false });
});

// 获取用户信息
async function getUserFromSession(req) {
    const sessionId = req.headers['authorization'];
    if (sessionId) {
        // 尝试使用数据库存储
        if (dbConnected) {
            try {
                // 创建数据库连接
                const connection = await mysql.createConnection(dbConfig);
                
                const [sessions] = await connection.execute(
                    'SELECT * FROM sessions WHERE session_id = ?',
                    [sessionId]
                );
                
                await connection.end();
                
                if (sessions.length > 0) {
                    return sessions[0].username;
                }
            } catch (error) {
                console.error('获取用户信息错误:', error);
                // 数据库失败，使用内存存储作为回退
                console.log('数据库获取用户信息失败，使用内存存储作为回退');
                useMemoryStorage();
            }
        }
        
        // 使用内存存储
        const session = sessions.find(session => session.sessionId === sessionId);
        if (session) {
            return session.username;
        }
    }
    return null;
}

// 保存搜索历史API
app.post('/api/history', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: '请先登录' });
    }
    
    const { destination, checkIn, checkOut } = req.body;
    if (!destination || !checkIn || !checkOut) {
        return res.json({ success: false, message: '搜索信息不完整' });
    }
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            // 保存搜索历史
            await connection.execute(
                'INSERT INTO search_history (username, destination, check_in, check_out) VALUES (?, ?, ?, ?)',
                [username, destination, checkIn, checkOut]
            );
            
            // 限制历史记录数量
            await connection.execute(
                'DELETE FROM search_history WHERE username = ? AND id NOT IN (SELECT id FROM (SELECT id FROM search_history WHERE username = ? ORDER BY timestamp DESC LIMIT 10) as temp)',
                [username, username]
            );
            
            // 关闭连接
            await connection.end();
            
            res.json({ success: true });
        } catch (error) {
            console.error('保存搜索历史错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库保存搜索历史失败，使用内存存储作为回退');
            useMemoryStorage();
        }
    }
    
    // 使用内存存储
    // 保存搜索历史
    if (!searchHistory[username]) {
        searchHistory[username] = [];
    }
    
    searchHistory[username].unshift({ destination, checkIn, checkOut, timestamp: new Date().toISOString() });
    
    // 限制历史记录数量
    if (searchHistory[username].length > 10) {
        searchHistory[username] = searchHistory[username].slice(0, 10);
    }
    
    res.json({ success: true });
});

// 获取搜索历史API
app.get('/api/history', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: '请先登录', history: [] });
    }
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            // 获取搜索历史
            const [history] = await connection.execute(
                'SELECT destination, check_in as checkIn, check_out as checkOut, timestamp FROM search_history WHERE username = ? ORDER BY timestamp DESC',
                [username]
            );
            
            // 关闭连接
            await connection.end();
            
            res.json({ success: true, history });
        } catch (error) {
            console.error('获取搜索历史错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库获取搜索历史失败，使用内存存储作为回退');
            useMemoryStorage();
        }
    }
    
    // 使用内存存储
    const history = searchHistory[username] || [];
    res.json({ success: true, history });
});

// 收藏酒店API
app.post('/api/favorites', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: '请先登录' });
    }
    
    const hotel = req.body;
    if (!hotel.id || !hotel.name || !hotel.address || !hotel.price || !hotel.image) {
        return res.json({ success: false, message: '酒店信息不完整' });
    }
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            // 检查是否已经收藏
            const [existingFavorites] = await connection.execute(
                'SELECT * FROM favorites WHERE username = ? AND hotel_id = ?',
                [username, hotel.id]
            );
            
            if (existingFavorites.length > 0) {
                await connection.end();
                return res.json({ success: false, message: '酒店已收藏' });
            }
            
            // 保存收藏
            await connection.execute(
                'INSERT INTO favorites (username, hotel_id, hotel_name, hotel_address, hotel_price, hotel_image) VALUES (?, ?, ?, ?, ?, ?)',
                [username, hotel.id, hotel.name, hotel.address, hotel.price, hotel.image]
            );
            
            // 关闭连接
            await connection.end();
            
            res.json({ success: true });
        } catch (error) {
            console.error('收藏酒店错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库收藏酒店失败，使用内存存储作为回退');
            useMemoryStorage();
        }
    }
    
    // 使用内存存储
    // 检查是否已经收藏
    if (!favorites[username]) {
        favorites[username] = [];
    }
    
    const existingFavorite = favorites[username].find(fav => fav.id === hotel.id);
    if (existingFavorite) {
        return res.json({ success: false, message: '酒店已收藏' });
    }
    
    favorites[username].push(hotel);
    res.json({ success: true });
});

// 获取收藏酒店API
app.get('/api/favorites', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: '请先登录', favorites: [] });
    }
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            // 获取收藏酒店
            const [favorites] = await connection.execute(
                'SELECT hotel_id as id, hotel_name as name, hotel_address as address, hotel_price as price, hotel_image as image FROM favorites WHERE username = ?',
                [username]
            );
            
            // 关闭连接
            await connection.end();
            
            res.json({ success: true, favorites });
        } catch (error) {
            console.error('获取收藏酒店错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库获取收藏酒店失败，使用内存存储作为回退');
            useMemoryStorage();
        }
    }
    
    // 使用内存存储
    const userFavorites = favorites[username] || [];
    res.json({ success: true, favorites: userFavorites });
});

// 取消收藏酒店API
app.delete('/api/favorites/:id', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: '请先登录' });
    }
    
    const hotelId = req.params.id;
    
    // 尝试使用数据库存储
    if (dbConnected) {
        try {
            // 创建数据库连接
            const connection = await mysql.createConnection(dbConfig);
            
            // 取消收藏
            const [result] = await connection.execute(
                'DELETE FROM favorites WHERE username = ? AND hotel_id = ?',
                [username, hotelId]
            );
            
            // 关闭连接
            await connection.end();
            
            if (result.affectedRows > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: '酒店未收藏' });
            }
        } catch (error) {
            console.error('取消收藏酒店错误:', error);
            // 数据库失败，使用内存存储作为回退
            console.log('数据库取消收藏酒店失败，使用内存存储作为回退');
            useMemoryStorage();
        }
    }
    
    // 使用内存存储
    if (!favorites[username]) {
        return res.json({ success: false, message: '暂无收藏酒店' });
    }
    
    const initialLength = favorites[username].length;
    favorites[username] = favorites[username].filter(hotel => hotel.id !== hotelId);
    
    if (favorites[username].length < initialLength) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: '酒店未收藏' });
    }
});

// 静态文件服务
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath));

// 根路径重定向到index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});