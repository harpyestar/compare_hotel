const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// 省份代码映射修复
const provinceCodeFixes = {
    // 国内省份代码修复
    'CKG': 'CQG', // 重庆
    'HEN': 'HAN', // 河南
    'BAK': 'XJG', // 新疆（阿克苏）
    'BJ': 'BEJ',  // 北京
    'GZU': 'GSU', // 贵州
    'SYX': 'HAI', // 海南（三亚）
    'SZX': 'GDN', // 广东（深圳）
    'MGZ': 'GDN', // 广东（梅州）
    
    // 国外省份代码映射到香港
    'Toukyou': 'HKG',
    'NorthThiladhunmathi': 'HKG',
    'Dubai': 'HKG',
    'GLONDON': 'HKG',
    'CALIFORNIA': 'HKG',
    'NSW': 'HKG',
    'niigataken': 'HKG',
    'qld': 'HKG',
    'SUM': 'HKG',
    'NYSTATE': 'HKG',
    'INA': 'HKG',
    'OSAKAPU': 'HKG',
    'TH': 'HKG',
    'KOREA': 'HKG',
    'JAPAN': 'HKG',
    'Seoul': 'HKG',
    'SELANGOR': 'HKG',
    'IledeFrance': 'HKG',
    'PHILIPP': 'HKG',
    'Singapore': 'HKG',
    'blr': 'HKG',
    'toukyouto': 'HKG',
    'Sanma': 'HKG',
    'BadenW眉rttemberg': 'HKG',
    'DCA': 'HKG',
    'BALI': 'HKG',
    
    // 无效省份代码映射到香港
    '#N/A!': 'HKG',
    '10037': 'HKG',
    '11107': 'HKG',
    '10872': 'HKG',
    '10892': 'HKG',
    '100732': 'HKG',
    '10136': 'HKG',
    '10274': 'HKG',
    '10068': 'HKG'
};

async function fixCityProvinceIds() {
    try {
        const SQL = await initSqlJs();
        const dbPath = path.join(__dirname, '..', 'data', 'hotel_search.db');
        const fileBuffer = fs.readFileSync(dbPath);
        const db = new SQL.Database(fileBuffer);

        console.log('开始修复city表的province_id...');

        // 获取所有province_id为1的城市
        const citiesWithProvinceId1 = db.exec('SELECT city_id, city_name FROM city WHERE province_id = 1');
        console.log('需要修复的城市数量:', citiesWithProvinceId1[0].values.length);

        let fixedCount = 0;

        for (const [cityId, cityName] of citiesWithProvinceId1[0].values) {
            // 从hotel_info中获取对应的省份代码
            const hotelProvinceResult = db.exec('SELECT DISTINCT province FROM hotel_info WHERE city_name = ?', [cityName]);
            
            if (hotelProvinceResult.length > 0 && hotelProvinceResult[0].values.length > 0) {
                let provinceCode = hotelProvinceResult[0].values[0][0];
                
                // 应用省份代码修复
                if (provinceCodeFixes[provinceCode]) {
                    provinceCode = provinceCodeFixes[provinceCode];
                }
                
                // 查询省份ID
                const provinceIdResult = db.exec('SELECT id FROM provinces WHERE province_code = ?', [provinceCode]);
                
                if (provinceIdResult.length > 0 && provinceIdResult[0].values.length > 0) {
                    const provinceId = provinceIdResult[0].values[0][0];
                    
                    // 更新city表中的province_id
                    db.run('UPDATE city SET province_id = ? WHERE city_id = ?', [provinceId, cityId]);
                    fixedCount++;
                }
            }
        }

        console.log(`修复完成，更新了 ${fixedCount} 个城市的province_id`);

        // 验证修复结果
        const remainingProvinceId1 = db.exec('SELECT COUNT(*) as count FROM city WHERE province_id = 1');
        console.log('修复后province_id为1的城市数量:', remainingProvinceId1[0].values[0][0]);

        const provinceIdStats = db.exec('SELECT province_id, COUNT(*) as count FROM city GROUP BY province_id ORDER BY count DESC');
        console.log('\n修复后省份ID分布:');
        provinceIdStats[0].values.forEach(([provinceId, count]) => {
            console.log(`${provinceId}: ${count}`);
        });

        // 保存数据库
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
        console.log('数据库已保存');

        db.close();
        console.log('city表province_id修复完成！');

    } catch (error) {
        console.error('修复city表province_id时出错:', error);
        process.exit(1);
    }
}

fixCityProvinceIds();