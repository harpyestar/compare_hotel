const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

async function verifyData() {
    try {
        const SQL = await initSqlJs();
        const dbPath = path.join(__dirname, 'data', 'hotel_search.db');
        
        if (!fs.existsSync(dbPath)) {
            console.log('数据库文件不存在！');
            return;
        }

        const fileBuffer = fs.readFileSync(dbPath);
        const db = new SQL.Database(fileBuffer);

        console.log('=== 数据库验证报告 ===\n');

        // 验证省份表
        console.log('1. 省份表 (provinces)');
        console.log('------------------------');
        const provinceCount = db.exec('SELECT COUNT(*) as count FROM provinces');
        console.log(`总记录数: ${provinceCount[0].values[0][0]}`);

        const provinceSample = db.exec('SELECT province_code, province_name FROM provinces ORDER BY province_code LIMIT 10');
        console.log('\n前10条记录:');
        if (provinceSample.length > 0) {
            provinceSample[0].values.forEach(row => {
                console.log(`  ${row[0]} - ${row[1]}`);
            });
        }

        // 验证酒店表
        console.log('\n2. 酒店表 (hotel_info)');
        console.log('------------------------');
        const hotelCount = db.exec('SELECT COUNT(*) as count FROM hotel_info');
        console.log(`总记录数: ${hotelCount[0].values[0][0]}`);

        // 按城市统计酒店数量
        console.log('\n按城市统计 (前20个城市):');
        const cityStats = db.exec(`
            SELECT city_name, COUNT(*) as count 
            FROM hotel_info 
            WHERE city_name IS NOT NULL 
            GROUP BY city_name 
            ORDER BY count DESC 
            LIMIT 20
        `);
        if (cityStats.length > 0) {
            cityStats[0].values.forEach(row => {
                console.log(`  ${row[0]}: ${row[1]} 家酒店`);
            });
        }

        // 按省份统计酒店数量
        console.log('\n按省份统计:');
        const provinceStats = db.exec(`
            SELECT p.province_name, COUNT(h.id) as count 
            FROM provinces p 
            LEFT JOIN hotel_info h ON p.province_code = h.province 
            GROUP BY p.province_code, p.province_name 
            ORDER BY count DESC 
            LIMIT 15
        `);
        if (provinceStats.length > 0) {
            provinceStats[0].values.forEach(row => {
                console.log(`  ${row[0]}: ${row[1]} 家酒店`);
            });
        }

        // 显示一些酒店示例
        console.log('\n酒店示例 (广州):');
        const guangzhouHotels = db.exec(`
            SELECT hotel_id, chn_name3, chn_address 
            FROM hotel_info 
            WHERE city_name = '广州' 
            LIMIT 5
        `);
        if (guangzhouHotels.length > 0) {
            guangzhouHotels[0].values.forEach(row => {
                console.log(`  [${row[0]}] ${row[1]}`);
                console.log(`    地址: ${row[2] || 'N/A'}`);
            });
        }

        // 验证表结构
        console.log('\n3. 表结构验证');
        console.log('------------------------');
        
        // 获取provinces表的列信息
        const provinceColumns = db.exec("PRAGMA table_info(provinces)");
        console.log('\nprovinces 表结构:');
        if (provinceColumns.length > 0) {
            provinceColumns[0].values.forEach(row => {
                console.log(`  ${row[1]} (${row[2]})${row[3] ? ' NOT NULL' : ''}${row[4] ? ' DEFAULT ' + row[4] : ''}`);
            });
        }

        // 获取hotel_info表的列信息
        const hotelColumns = db.exec("PRAGMA table_info(hotel_info)");
        console.log('\nhotel_info 表结构:');
        if (hotelColumns.length > 0) {
            hotelColumns[0].values.forEach(row => {
                console.log(`  ${row[1]} (${row[2]})${row[3] ? ' NOT NULL' : ''}${row[4] ? ' DEFAULT ' + row[4] : ''}`);
            });
        }

        db.close();
        console.log('\n=== 验证完成 ===');

    } catch (error) {
        console.error('验证数据时出错:', error);
        process.exit(1);
    }
}

verifyData();
