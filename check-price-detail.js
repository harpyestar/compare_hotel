const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// 数据库路径
const dbPath = path.join(__dirname, 'data', 'hotel_search.db');

async function checkPriceDetail() {
    try {
        // 初始化SQL
        const SQL = await initSqlJs();
        
        // 读取数据库文件
        const fileBuffer = fs.readFileSync(dbPath);
        const db = new SQL.Database(fileBuffer);
        
        // 检查price_detail表的记录数
        const countResult = db.exec('SELECT COUNT(*) as count FROM price_detail');
        const count = countResult[0].values[0][0];
        console.log(`price_detail表记录数: ${count}`);
        
        // 检查前5条记录
        console.log('\n前5条price_detail记录:');
        const sampleResult = db.exec('SELECT * FROM price_detail LIMIT 5');
        if (sampleResult.length > 0 && sampleResult[0].values.length > 0) {
            sampleResult[0].values.forEach((row, index) => {
                console.log(`记录 ${index + 1}:`, row);
            });
        }
        
        // 检查hotel_id是否与hotel_info表匹配
        console.log('\n检查hotel_id匹配情况:');
        const matchResult = db.exec('SELECT COUNT(*) as count FROM price_detail p JOIN hotel_info h ON p.hotel_id = h.hotel_id LIMIT 5');
        const matchCount = matchResult[0].values[0][0];
        console.log(`匹配的记录数: ${matchCount}`);
        
        // 检查具体的匹配记录
        console.log('\n具体的匹配记录:');
        const joinResult = db.exec('SELECT p.hotel_id, p.platform, p.price, h.chn_name3 FROM price_detail p JOIN hotel_info h ON p.hotel_id = h.hotel_id LIMIT 5');
        if (joinResult.length > 0 && joinResult[0].values.length > 0) {
            joinResult[0].values.forEach((row, index) => {
                console.log(`记录 ${index + 1}:`, row);
            });
        }
        
        db.close();
    } catch (error) {
        console.error('检查数据库失败:', error);
    }
}

checkPriceDetail();