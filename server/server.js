const express = require('express');
const cors = require('cors');
const path = require('path');
const initSqlJs = require('sql.js');
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const middleware = require('i18next-express-middleware');
const app = express();

// 初始化i18next
i18next
  .use(Backend)
  .init({
    fallbackLng: 'zh-CN',
    debug: false,
    backend: {
      loadPath: path.join(__dirname, '..', 'locales', '{{lng}}.json')
    }
  });

// 使用i18next中间件
app.use(middleware.handle(i18next));

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
    
    // 内蒙古自治区
    '呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安', '锡林郭勒', '阿拉善',
    
    // 台湾省
    '台北', '高雄', '台南', '台中', '桃园', '新竹', '嘉义',
    
    // 香港特别行政区
    '香港',
    
    // 澳门特别行政区
    '澳门'
];

// 数据库连接配置
const dbPath = path.join(__dirname, '..', 'data', 'hotel_search.db');

let dbConnected = false;
let db;
const fs = require('fs');

// 保存数据库到文件
function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// 生成会话ID
function generateSessionId() {
    return Math.random().toString(36).substr(2, 9);
}

// 初始化数据库
async function initDatabase() {
    try {
        const SQL = await initSqlJs();
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
        dbConnected = true;
        console.log('数据库连接成功');
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
            return res.json({ success: false, message: req.t('messages.registerFailed') });
        }

        if (!dbConnected) {
            return res.json({ success: false, message: req.t('messages.databaseError') });
        }

        try {
            const existingUsers = db.exec('SELECT * FROM users WHERE username = ?', [username]);

            if (existingUsers.length > 0 && existingUsers[0].values.length > 0) {
                return res.json({ success: false, message: req.t('messages.usernameExists') });
            }

            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
            saveDatabase();

            const sessionId = generateSessionId();
            db.run('INSERT INTO sessions (session_id, username) VALUES (?, ?)', [sessionId, username]);
            saveDatabase();

            return res.json({ success: true, username, sessionId });
        } catch (error) {
            console.error('注册错误:', error);
            return res.json({ success: false, message: req.t('messages.registerFailed') });
        }
    } catch (error) {
        console.error('注册API错误:', error);
        return res.json({ success: false, message: req.t('messages.registerFailed') });
    }
});

// 登录API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ success: false, message: req.t('messages.loginFailed') });
    }

    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError') });
    }

    try {
        const users = db.exec('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (users.length === 0 || users[0].values.length === 0) {
            return res.json({ success: false, message: req.t('messages.loginFailed') });
        }

        const sessionId = generateSessionId();
        db.run('INSERT INTO sessions (session_id, username) VALUES (?, ?)', [sessionId, username]);
        saveDatabase();

        res.json({ success: true, username, sessionId });
    } catch (error) {
        console.error('登录错误:', error);
        return res.json({ success: false, message: req.t('messages.loginFailed') });
    }
});

// 退出登录API
app.post('/api/logout', async (req, res) => {
    const sessionId = req.headers['authorization'];

    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError') });
    }

    try {
        if (sessionId) {
            db.run('DELETE FROM sessions WHERE session_id = ?', [sessionId]);
            saveDatabase();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('退出登录错误:', error);
        return res.json({ success: false, message: req.t('messages.logoutFailed') });
    }
});

// 检查登录状态API
app.get('/api/check-login', async (req, res) => {
    const sessionId = req.headers['authorization'];

    if (!dbConnected) {
        return res.json({ loggedIn: false, message: req.t('messages.databaseError') });
    }

    try {
        if (sessionId) {
            const sessions = db.exec('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);

            if (sessions.length > 0 && sessions[0].values.length > 0) {
                return res.json({ loggedIn: true, username: sessions[0].values[0][2], sessionId: sessionId });
            }
        }

        res.json({ loggedIn: false });
    } catch (error) {
        console.error('检查登录状态错误:', error);
        return res.json({ loggedIn: false, message: req.t('messages.loginCheckFailed') });
    }
});

// 获取用户信息
async function getUserFromSession(req) {
    const sessionId = req.headers['authorization'];
    console.log('Session ID from header:', sessionId);
    if (sessionId && dbConnected) {
        try {
            console.log('Executing session query with sessionId:', sessionId);
            const sessions = db.exec('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);
            console.log('Session query result:', sessions);

            if (sessions.length > 0 && sessions[0].values.length > 0) {
                console.log('Found user:', sessions[0].values[0][2]);
                return sessions[0].values[0][2];
            }
        } catch (error) {
            console.error('获取用户信息错误:', error);
        }
    }
    console.log('No user found');
    return null;
}

// 保存搜索历史API
app.post('/api/history', async (req, res) => {
    console.log('Received save history request');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    const username = await getUserFromSession(req);
    console.log('Username from session:', username);
    
    const { destination, checkIn, checkOut, type, city, hotel } = req.body;
    console.log('Search parameters:', { destination, checkIn, checkOut, type, city, hotel });
    if (!destination || !checkIn || !checkOut) {
        console.log('Missing required parameters');
        return res.json({ success: false, message: req.t('messages.searchInfoIncomplete') });
    }

    if (!dbConnected) {
        console.log('Database not connected');
        return res.json({ success: false, message: req.t('messages.databaseError') });
    }

    try {
        const finalType = type === 'hotel' ? 'hotel' : 'city';
        console.log('Final type:', finalType);

        // 无论用户是否登录，都保存搜索记录到数据库
        // 对于未登录用户，username字段设为'guest'
        const user = username || 'guest';
        
        console.log('Executing INSERT statement for user:', user);
        db.run(
            'INSERT INTO search_history (username, destination, city, hotel, type, check_in, check_out) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user, destination, city || null, hotel || null, finalType, checkIn, checkOut]
        );
        console.log('INSERT statement executed');

        // 只对登录用户进行历史记录限制
        if (username) {
            // 只保留最近10条酒店搜索历史
            const historyIds = db.exec(
                'SELECT id FROM search_history WHERE username = ? AND type = ? ORDER BY timestamp DESC LIMIT 10',
                [username, 'hotel']
            );
            console.log('Hotel history IDs:', historyIds);
            if (historyIds.length > 0 && historyIds[0].values.length > 0) {
                const idsToKeep = historyIds[0].values.map(v => v[0]).join(',');
                if (idsToKeep) {
                    console.log('Deleting old hotel history with IDs not in:', idsToKeep);
                    db.run(`DELETE FROM search_history WHERE username = ? AND type = 'hotel' AND id NOT IN (${idsToKeep})`, [username]);
                }
            }

            // 只保留最近10条城市搜索历史
            const cityHistoryIds = db.exec(
                'SELECT id FROM search_history WHERE username = ? AND type = ? ORDER BY timestamp DESC LIMIT 10',
                [username, 'city']
            );
            console.log('City history IDs:', cityHistoryIds);
            if (cityHistoryIds.length > 0 && cityHistoryIds[0].values.length > 0) {
                const idsToKeep = cityHistoryIds[0].values.map(v => v[0]).join(',');
                if (idsToKeep) {
                    console.log('Deleting old city history with IDs not in:', idsToKeep);
                    db.run(`DELETE FROM search_history WHERE username = ? AND type = 'city' AND id NOT IN (${idsToKeep})`, [username]);
                }
            }
        }

        console.log('Saving database');
        saveDatabase();
        console.log('Database saved');
        res.json({ success: true });
        console.log('Response sent successfully');
    } catch (error) {
        console.error('保存搜索历史错误:', error);
        return res.json({ success: false, message: req.t('messages.saveHistoryFailed') });
    }
});

// 获取搜索历史API
app.get('/api/history', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: req.t('messages.loginRequired'), history: [] });
    }

    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError'), history: [] });
    }

    try {
        const result = db.exec(
            'SELECT destination, check_in as checkIn, check_out as checkOut, timestamp FROM search_history WHERE username = ? ORDER BY timestamp DESC',
            [username]
        );

        let history = [];
        if (result.length > 0 && result[0].values.length > 0) {
            const columns = result[0].columns;
            history = result[0].values.map(row => {
                const obj = {};
                columns.forEach((col, i) => obj[col] = row[i]);
                return obj;
            });
        }

        res.json({ success: true, history });
    } catch (error) {
        console.error('获取搜索历史错误:', error);
        return res.json({ success: false, message: req.t('messages.getHistoryFailed'), history: [] });
    }
});

// 收藏酒店API
app.post('/api/favorites', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: req.t('messages.loginRequired') });
    }

    const hotel = req.body;
    if (!hotel.id || !hotel.name || !hotel.address || !hotel.price || !hotel.image) {
        return res.json({ success: false, message: req.t('messages.hotelInfoIncomplete') });
    }

    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError') });
    }

    try {
        const existingFavorites = db.exec('SELECT * FROM favorites WHERE username = ? AND hotel_id = ?', [username, hotel.id]);

        if (existingFavorites.length > 0 && existingFavorites[0].values.length > 0) {
            return res.json({ success: false, message: req.t('messages.hotelAlreadyFavorited') });
        }

        db.run(
            'INSERT INTO favorites (username, hotel_id, hotel_name, hotel_address, hotel_price, hotel_image) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hotel.id, hotel.name, hotel.address, hotel.price, hotel.image]
        );
        saveDatabase();

        res.json({ success: true });
    } catch (error) {
        console.error('收藏酒店错误:', error);
        return res.json({ success: false, message: req.t('messages.favoriteFailed') });
    }
});

// 获取收藏酒店API
app.get('/api/favorites', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: req.t('messages.loginRequired'), favorites: [] });
    }

    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError'), favorites: [] });
    }

    try {
        const result = db.exec(
            'SELECT hotel_id as id, hotel_name as name, hotel_address as address, hotel_price as price, hotel_image as image FROM favorites WHERE username = ?',
            [username]
        );

        let favorites = [];
        if (result.length > 0 && result[0].values.length > 0) {
            const columns = result[0].columns;
            favorites = result[0].values.map(row => {
                const obj = {};
                columns.forEach((col, i) => obj[col] = row[i]);
                return obj;
            });
        }

        res.json({ success: true, favorites });
    } catch (error) {
        console.error('获取收藏酒店错误:', error);
        return res.json({ success: false, message: req.t('messages.getFavoritesFailed'), favorites: [] });
    }
});

// 取消收藏酒店API
app.delete('/api/favorites/:id', async (req, res) => {
    const username = await getUserFromSession(req);
    if (!username) {
        return res.json({ success: false, message: req.t('messages.loginRequired') });
    }

    const hotelId = req.params.id;

    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError') });
    }

    try {
        db.run('DELETE FROM favorites WHERE username = ? AND hotel_id = ?', [username, hotelId]);
        saveDatabase();

        res.json({ success: true });
    } catch (error) {
        console.error('取消收藏酒店错误:', error);
        return res.json({ success: false, message: req.t('messages.unfavoriteFailed') });
    }
});

// 获取热门酒店搜索API
app.get('/api/hot-hotels', async (req, res) => {
    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError'), hotels: [] });
    }

    try {
        const result = db.exec(`
            SELECT
                COALESCE(hotel, destination) as name,
                COUNT(*) as count
            FROM search_history
            WHERE type = 'hotel' AND (hotel IS NOT NULL OR destination LIKE '%酒店%' OR destination LIKE '%饭店%' OR destination LIKE '%宾馆%')
            GROUP BY COALESCE(hotel, destination)
            ORDER BY count DESC
            LIMIT 10
        `);

        let hotels = [];
        if (result.length > 0 && result[0].values.length > 0) {
            const columns = result[0].columns;
            hotels = result[0].values.map(row => {
                const obj = {};
                columns.forEach((col, i) => obj[col] = row[i]);
                return obj;
            });
        }

        res.json({ success: true, hotels });
    } catch (error) {
        console.error('获取热门酒店搜索错误:', error);
        return res.json({ success: false, message: req.t('messages.getHotHotelsFailed'), hotels: [] });
    }
});

// 获取热门城市搜索API
app.get('/api/hot-cities', async (req, res) => {
    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError'), cities: [] });
    }

    try {
        const result = db.exec(`
            SELECT
                COALESCE(city, destination) as name,
                COUNT(*) as count
            FROM search_history
            WHERE type = 'city' AND (city IS NOT NULL OR (destination NOT LIKE '%酒店%' AND destination NOT LIKE '%饭店%' AND destination NOT LIKE '%宾馆%'))
            GROUP BY COALESCE(city, destination)
            ORDER BY count DESC
            LIMIT 10
        `);

        let cities = [];
        if (result.length > 0 && result[0].values.length > 0) {
            const columns = result[0].columns;
            cities = result[0].values.map(row => {
                const obj = {};
                columns.forEach((col, i) => obj[col] = row[i]);
                return obj;
            });
        }

        res.json({ success: true, cities });
    } catch (error) {
        console.error('获取热门城市搜索错误:', error);
        return res.json({ success: false, message: req.t('messages.getHotCitiesFailed'), cities: [] });
    }
});

// 静态文件服务
const staticPath = path.join(__dirname, '..');
console.log('静态文件路径:', staticPath);
app.use(express.static(staticPath));

// 获取省份和城市关联数据API
app.get('/api/provinces-cities', async (req, res) => {
    if (!dbConnected) {
        return res.json({ success: false, message: req.t('messages.databaseError'), data: [] });
    }

    try {
        // 获取所有省份
        const provincesResult = db.exec('SELECT id, province_name FROM provinces ORDER BY id');
        let provinces = [];
        if (provincesResult.length > 0 && provincesResult[0].values.length > 0) {
            provinces = provincesResult[0].values.map(row => ({
                id: row[0],
                name: row[1],
                cities: []
            }));
        }

        // 获取所有城市并按省份分组
        const citiesResult = db.exec('SELECT c.city_id, c.city_name, c.city_latitude, c.city_longitude, c.province_id, p.province_name FROM city c LEFT JOIN provinces p ON c.province_id = p.id ORDER BY c.province_id, c.city_name');
        if (citiesResult.length > 0 && citiesResult[0].values.length > 0) {
            citiesResult[0].values.forEach(row => {
                const cityId = row[0];
                const cityName = row[1];
                const cityLat = row[2];
                const cityLng = row[3];
                const provinceId = row[4];
                const provinceName = row[5];

                const province = provinces.find(p => p.id == provinceId);
                if (province) {
                    province.cities.push({ id: cityId, name: cityName, lat: cityLat, lng: cityLng });
                }
            });
        }

        res.json({ success: true, data: provinces });
    } catch (error) {
        console.error('获取省份城市数据错误:', error);
        return res.json({ success: false, message: '获取数据失败', data: [] });
    }
});

// 根路径重定向到index.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    console.log('Index.html路径:', indexPath);
    res.sendFile(indexPath);
});

// 搜索酒店API
app.get('/api/search', async (req, res) => {
    try {
        console.log('接收到搜索请求:', req.query);
        const { city, hotel, page = 1, limit = 10, sort = 'default' } = req.query;
        
        if (!city) {
            console.log('缺少城市参数');
            return res.json({ success: false, message: '请提供城市名称' });
        }
        
        if (!dbConnected) {
            console.log('数据库未连接');
            return res.json({ success: false, message: '数据库未连接' });
        }
        
        // 对city和hotel参数进行URL解码
        const decodedCity = decodeURIComponent(city);
        const decodedHotel = hotel ? decodeURIComponent(hotel) : '';
        console.log('解码后的参数:', { city: decodedCity, hotel: decodedHotel });
        
        // 确保参数类型正确
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        console.log('解析后的参数:', { city: decodedCity, hotel: decodedHotel, page: pageNum, limit: limitNum, sort });
        
        // 计算偏移量
        const offset = (pageNum - 1) * limitNum;
        console.log('计算偏移量:', offset);
        
        // 首先从hotel_info表获取符合条件的酒店ID列表
        let hotelIdsSql = `
            SELECT DISTINCT hotel_id
            FROM hotel_info
            WHERE city_name LIKE '%${decodedCity}%'
        `;
        
        // 如果提供了酒店名称，添加酒店名称过滤
        if (decodedHotel) {
            hotelIdsSql += ` AND chn_name3 LIKE '%${decodedHotel}%'`;
        }
        
        console.log('执行酒店ID查询:', hotelIdsSql);
        
        try {
            // 执行酒店ID查询
            console.log('开始执行酒店ID查询...');
            
            // 使用prepare方法执行查询
            const stmt = db.prepare(hotelIdsSql);
            const hotelIds = [];
            
            while (stmt.step()) {
                const row = stmt.get();
                console.log('获取到酒店ID:', row[0]);
                hotelIds.push(row[0]);
            }
            stmt.free();
            
            console.log('酒店ID查询完成，获取到', hotelIds.length, '个酒店ID');
            console.log('酒店ID列表:', hotelIds);
            
            if (hotelIds.length === 0) {
                console.log('查询结果为空');
                // 直接返回空数据
                res.json({
                    success: true,
                    data: {
                        hotels: [],
                        total: 0,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: 0
                    }
                });
                return;
            }
            
            try {
                // 获取总记录数
                console.log('开始获取总记录数...');
                let countSql = `SELECT COUNT(DISTINCT hotel_id) as count FROM hotel_info WHERE city_name LIKE '%${decodedCity}%'`;
                
                // 如果提供了酒店名称，添加酒店名称过滤
                if (decodedHotel) {
                    countSql += ` AND chn_name3 LIKE '%${decodedHotel}%'`;
                }
                
                console.log('执行总记录数查询:', countSql);
                
                let totalCount = 0;
                try {
                    // 使用prepare方法执行查询
                    const stmt = db.prepare(countSql);
                    
                    if (stmt.step()) {
                        const row = stmt.get();
                        console.log('总记录数查询结果:', row);
                        totalCount = row[0];
                    }
                    stmt.free();
                    
                    console.log('总记录数查询执行完成');
                } catch (error) {
                    console.error('执行总记录数查询失败:', error);
                    // 继续执行，使用默认值0
                }
                
                console.log('总记录数:', totalCount);
                
                // 根据酒店ID查询详细信息和价格，带排序和分页
                console.log('开始查询酒店详细信息...');
                let hotelDetailsSql = `
                    SELECT h.hotel_id, h.chn_name3 as name, h.city_name, h.chn_address as address, 
                           p.platform, p.price, p.distance, p.rating
                    FROM hotel_info h
                    JOIN price_detail p ON h.hotel_id = p.hotel_id
                    WHERE h.hotel_id IN (${hotelIds.join(',')})
                `;
                
                // 添加排序
                switch (sort) {
                    case 'price_asc':
                        hotelDetailsSql += ' ORDER BY p.price ASC';
                        break;
                    case 'price_desc':
                        hotelDetailsSql += ' ORDER BY p.price DESC';
                        break;
                    case 'rating_asc':
                        hotelDetailsSql += ' ORDER BY p.rating ASC';
                        break;
                    case 'rating_desc':
                        hotelDetailsSql += ' ORDER BY p.rating DESC';
                        break;
                    case 'distance_asc':
                        hotelDetailsSql += ' ORDER BY p.distance ASC';
                        break;
                    case 'distance_desc':
                        hotelDetailsSql += ' ORDER BY p.distance DESC';
                        break;
                    default:
                        hotelDetailsSql += ' ORDER BY p.price ASC';
                }
                
                // 添加分页
                hotelDetailsSql += ` LIMIT ${limitNum} OFFSET ${offset}`;
                console.log('执行酒店详细信息查询:', hotelDetailsSql);
                
                // 整理数据
                const hotelsMap = new Map();
                
                try {
                    // 使用prepare方法执行查询
                    const stmt = db.prepare(hotelDetailsSql);
                    
                    console.log('开始整理数据...');
                    let recordCount = 0;
                    
                    while (stmt.step()) {
                        const row = stmt.get();
                        recordCount++;
                        console.log('处理记录:', row);
                        const [hotel_id, name, city_name, address, platform, price, distance, rating] = row;
                        
                        if (!hotelsMap.has(hotel_id)) {
                            hotelsMap.set(hotel_id, {
                                id: hotel_id,
                                name: name,
                                address: address,
                                rating: parseFloat(rating),
                                distance: distance + '公里',
                                platforms: []
                            });
                            console.log('创建新酒店:', hotel_id, name);
                        }
                        
                        hotelsMap.get(hotel_id).platforms.push({
                            name: platform,
                            price: parseFloat(price),
                            link: '#'
                        });
                        console.log('添加平台:', platform, price);
                    }
                    stmt.free();
                    
                    console.log('有酒店详细信息数据，共', recordCount, '条记录');
                } catch (error) {
                    console.error('执行酒店详细信息查询失败:', error);
                    // 继续执行，返回空数据
                }
                
                if (hotelsMap.size === 0) {
                    console.log('没有酒店详细信息数据');
                }
                
                const hotels = Array.from(hotelsMap.values());
                console.log('整理完成，共', hotels.length, '家酒店');
                console.log('第一家酒店:', hotels[0]);
                if (hotels[0]) {
                    console.log('第一家酒店的platforms:', hotels[0].platforms);
                }
                
                res.json({
                    success: true,
                    data: {
                        hotels: hotels,
                        total: totalCount,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(totalCount / limitNum)
                    }
                });
                console.log('响应成功');
            } catch (countError) {
                console.error('获取总记录数失败:', countError);
                res.json({ success: false, message: '获取总记录数失败' });
            }
        } catch (queryError) {
            console.error('执行查询失败:', queryError);
            res.json({ success: false, message: '执行查询失败' });
        }
        
    } catch (error) {
        console.error('搜索酒店失败:', error);
        res.json({ success: false, message: '搜索失败' });
    }
});

// 启动服务器
const port = 3000;
try {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
} catch (error) {
    console.error('服务器启动错误:', error);
}