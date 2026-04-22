const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'hotel_search'
};

// 迁移数据
async function migrateData() {
    try {
        // 创建数据库连接
        const connection = await mysql.createConnection(dbConfig);
        console.log('数据库连接成功');
        
        // 检查并添加必要的字段
        try {
            await connection.execute('ALTER TABLE search_history ADD COLUMN IF NOT EXISTS type ENUM(\'hotel\', \'city\') NOT NULL DEFAULT \'city\'');
            console.log('type字段添加成功');
        } catch (error) {
            console.log('type字段已存在');
        }
        
        try {
            await connection.execute('ALTER TABLE search_history ADD COLUMN IF NOT EXISTS city VARCHAR(50) NULL');
            console.log('city字段添加成功');
        } catch (error) {
            console.log('city字段已存在');
        }
        
        try {
            await connection.execute('ALTER TABLE search_history ADD COLUMN IF NOT EXISTS hotel VARCHAR(100) NULL');
            console.log('hotel字段添加成功');
        } catch (error) {
            console.log('hotel字段已存在');
        }
        
        // 先获取所有记录，然后逐条处理
        const [rows] = await connection.execute('SELECT id, destination FROM search_history');
        console.log(`找到 ${rows.length} 条记录`);
        
        // 迁移每条记录
        let migratedCount = 0;
        for (const row of rows) {
            let city = null;
            let hotel = null;
            let type = 'city';
            
            // 尝试判断是城市还是酒店
            if (row.destination.includes('酒店') || row.destination.includes('饭店') || row.destination.includes('宾馆')) {
                type = 'hotel';
                hotel = row.destination;
                // 尝试从酒店名称中提取城市
                const cityMatch = row.destination.match(/^(北京|上海|广州|深圳|杭州|成都|重庆|三亚)/);
                if (cityMatch) {
                    city = cityMatch[1];
                }
            } else {
                type = 'city';
                city = row.destination;
            }
            
            // 更新记录
            await connection.execute(
                'UPDATE search_history SET city = ?, hotel = ?, type = ? WHERE id = ?',
                [city, hotel, type, row.id]
            );
            migratedCount++;
        }
        
        console.log(`数据迁移完成，共迁移 ${migratedCount} 条记录`);
        
        // 关闭连接
        await connection.end();
    } catch (error) {
        console.error('数据迁移失败:', error);
    }
}

// 运行迁移
migrateData();
