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

async function updateHotelInfoTable() {
    try {
        const SQL = await initSqlJs();
        const dbPath = path.join(__dirname, '..', 'data', 'hotel_search.db');
        const fileBuffer = fs.readFileSync(dbPath);
        const db = new SQL.Database(fileBuffer);

        console.log('开始更新hotel_info表...');

        // 检查是否已存在province_id字段
        const hotelInfoSchema = db.exec('PRAGMA table_info(hotel_info)');
        const hasProvinceId = hotelInfoSchema[0].values.some(row => row[1] === 'province_id');

        if (!hasProvinceId) {
            console.log('添加province_id字段到hotel_info表...');
            db.run('ALTER TABLE hotel_info ADD COLUMN province_id INTEGER');
            console.log('province_id字段添加成功');
        }

        // 获取所有需要修复的省份代码
        const provinceCodesResult = db.exec('SELECT DISTINCT province FROM hotel_info WHERE province IS NOT NULL');
        const provinceCodes = provinceCodesResult[0].values.map(row => row[0]);
        console.log('需要处理的省份代码数量:', provinceCodes.length);

        let fixedCount = 0;
        let provinceIdCount = 0;

        for (const provinceCode of provinceCodes) {
            // 应用省份代码修复
            let fixedProvinceCode = provinceCode;
            if (provinceCodeFixes[provinceCode]) {
                fixedProvinceCode = provinceCodeFixes[provinceCode];
            }

            // 查询省份ID
            const provinceIdResult = db.exec('SELECT id FROM provinces WHERE province_code = ?', [fixedProvinceCode]);
            let provinceId = null;
            if (provinceIdResult.length > 0 && provinceIdResult[0].values.length > 0) {
                provinceId = provinceIdResult[0].values[0][0];
            }

            // 更新省份代码和province_id
            if (fixedProvinceCode !== provinceCode || provinceId) {
                const updateQuery = [];
                const params = [];
                
                if (fixedProvinceCode !== provinceCode) {
                    updateQuery.push('province = ?');
                    params.push(fixedProvinceCode);
                }
                
                if (provinceId) {
                    updateQuery.push('province_id = ?');
                    params.push(provinceId);
                }
                
                if (updateQuery.length > 0) {
                    params.push(provinceCode);
                    db.run(`UPDATE hotel_info SET ${updateQuery.join(', ')} WHERE province = ?`, params);
                    
                    // 获取更新的记录数
                    const result = db.exec('SELECT changes()');
                    const updated = result[0].values[0][0];
                    fixedCount += updated;
                    provinceIdCount += updated;
                }
            }
        }

        console.log(`修复了 ${fixedCount} 条记录的省份代码`);
        console.log(`为 ${provinceIdCount} 条记录添加了province_id`);

        // 验证修复结果
        const fixedProvinceCodes = db.exec('SELECT province, COUNT(*) as count FROM hotel_info WHERE province IS NOT NULL GROUP BY province ORDER BY count DESC LIMIT 10');
        console.log('\n修复后前10个省份代码:');
        fixedProvinceCodes[0].values.forEach(row => console.log(row));

        const provinceIdStats = db.exec('SELECT COUNT(*) as count FROM hotel_info WHERE province_id IS NOT NULL');
        console.log('\n有province_id的记录数:', provinceIdStats[0].values[0][0]);

        const totalRecords = db.exec('SELECT COUNT(*) as count FROM hotel_info');
        console.log('总记录数:', totalRecords[0].values[0][0]);

        // 保存数据库
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
        console.log('数据库已保存');

        db.close();
        console.log('hotel_info表更新完成！');

    } catch (error) {
        console.error('更新hotel_info表时出错:', error);
        process.exit(1);
    }
}

updateHotelInfoTable();