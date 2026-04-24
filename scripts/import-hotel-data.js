const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

async function importData() {
    try {
        const SQL = await initSqlJs();
        const dbPath = path.join(__dirname, 'data', 'hotel_search.db');
        
        let db;
        if (fs.existsSync(dbPath)) {
            const fileBuffer = fs.readFileSync(dbPath);
            db = new SQL.Database(fileBuffer);
            console.log('数据库已存在，正在加载...');
        } else {
            db = new SQL.Database();
            console.log('创建新数据库...');
        }

        // 创建 provinces 表
        console.log('创建 provinces 表...');
        db.run(`
            CREATE TABLE IF NOT EXISTS provinces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                province_code TEXT UNIQUE NOT NULL,
                province_name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 创建 hotel_info 表
        console.log('创建 hotel_info 表...');
        db.run(`
            CREATE TABLE IF NOT EXISTS hotel_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hotel_id TEXT UNIQUE NOT NULL,
                chn_name3 TEXT NOT NULL,
                province TEXT,
                city_name TEXT,
                chn_address TEXT,
                pet_text TEXT,
                lng_baidu TEXT,
                lat_baidu TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 清空现有数据（如果需要重新导入）
        console.log('清空现有数据...');
        db.run('DELETE FROM hotel_info');
        db.run('DELETE FROM provinces');

        // 导入省份数据
        console.log('导入省份数据...');
        const provincesData = [
            ['AHI', '安徽'],
            ['FJN', '福建'],
            ['GDN', '广东'],
            ['GDS', '甘肃'],
            ['GSU', '贵州'],
            ['GXI', '广西'],
            ['GZU', '贵州'],
            ['HAN', '河南'],
            ['HBI', '湖北'],
            ['HEB', '河北'],
            ['HEN', '河南'],
            ['HKG', '香港'],
            ['HLJ', '黑龙江'],
            ['HNN', '湖南'],
            ['JLN', '吉林'],
            ['JSU', '江苏'],
            ['JXI', '江西'],
            ['LNG', '辽宁'],
            ['MAC', '澳门'],
            ['MGZ', '玛瑙州'],
            ['NMG', '内蒙古'],
            ['NXA', '宁夏'],
            ['QHI', '青海'],
            ['SCN', '四川'],
            ['SDG', '山东'],
            ['SHA', '上海'],
            ['SHX', '陕西'],
            ['SUM', '苏门答腊'],
            ['SXI', '陕西'],
            ['SYX', '山西'],
            ['SZX', '深圳'],
            ['TSN', '天津'],
            ['TWN', '台湾'],
            ['XJG', '新疆'],
            ['XZG', '西藏'],
            ['YNN', '云南'],
            ['ZJG', '浙江'],
            ['BAK', '泰国'],
            ['CAS', '新西兰'],
            ['DCA', '美国'],
            ['INA', '印度尼西亚'],
            ['NSW', '澳大利亚'],
            ['CKG', '重庆']
        ];

        const insertProvince = db.prepare('INSERT INTO provinces (province_code, province_name) VALUES (?, ?)');
        for (const [code, name] of provincesData) {
            try {
                insertProvince.run([code, name]);
            } catch (e) {
                console.log(`跳过重复的省份: ${code}`);
            }
        }
        insertProvince.free();
        console.log(`省份数据导入完成，共 ${provincesData.length} 条`);

        // 读取并解析 hotel_info.sql 文件
        console.log('读取 hotel_info.sql 文件...');
        const hotelSqlContent = fs.readFileSync(path.join(__dirname, 'sql', 'hotel_info.sql'), 'utf-8');
        
        // 解析 INSERT 语句
        const insertStatements = hotelSqlContent.match(/INSERT INTO "hotel_info"[^;]+;/g);
        console.log(`找到 ${insertStatements ? insertStatements.length : 0} 条酒店数据`);

        if (insertStatements && insertStatements.length > 0) {
            const insertHotel = db.prepare(`
                INSERT INTO hotel_info (hotel_id, chn_name3, province, city_name, chn_address, pet_text, lng_baidu, lat_baidu)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            let successCount = 0;
            let errorCount = 0;

            for (const statement of insertStatements) {
                try {
                    // 解析 VALUES 部分
                    const valuesMatch = statement.match(/VALUES \((.+)\);/);
                    if (valuesMatch) {
                        const valuesStr = valuesMatch[1];
                        // 使用正则表达式解析每个值
                        const values = [];
                        let current = '';
                        let inString = false;
                        
                        for (let i = 0; i < valuesStr.length; i++) {
                            const char = valuesStr[i];
                            if (char === "'" && valuesStr[i-1] !== '\\') {
                                inString = !inString;
                            }
                            if (char === ',' && !inString) {
                                values.push(current.trim());
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        values.push(current.trim());

                        // 去除引号并处理 NULL
                        const parsedValues = values.map(v => {
                            v = v.trim();
                            if (v === 'NULL') return null;
                            if (v.startsWith("'") && v.endsWith("'")) {
                                return v.slice(1, -1).replace(/\\'/g, "'");
                            }
                            return v;
                        });

                        if (parsedValues.length === 8) {
                            insertHotel.run(parsedValues);
                            successCount++;
                        }
                    }
                } catch (e) {
                    errorCount++;
                    if (errorCount <= 5) {
                        console.log(`导入错误: ${e.message}`);
                    }
                }
            }

            insertHotel.free();
            console.log(`酒店数据导入完成: 成功 ${successCount} 条, 失败 ${errorCount} 条`);
        }

        // 保存数据库
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
        console.log('数据库已保存');

        // 验证数据
        console.log('\n验证数据:');
        const provinceCount = db.exec('SELECT COUNT(*) as count FROM provinces');
        console.log(`省份表记录数: ${provinceCount[0].values[0][0]}`);
        
        const hotelCount = db.exec('SELECT COUNT(*) as count FROM hotel_info');
        console.log(`酒店表记录数: ${hotelCount[0].values[0][0]}`);

        // 显示一些示例数据
        console.log('\n省份表示例:');
        const provinceSample = db.exec('SELECT * FROM provinces LIMIT 5');
        if (provinceSample.length > 0) {
            console.log(provinceSample[0].values);
        }

        console.log('\n酒店表示例:');
        const hotelSample = db.exec('SELECT hotel_id, chn_name3, city_name FROM hotel_info LIMIT 5');
        if (hotelSample.length > 0) {
            console.log(hotelSample[0].values);
        }

        db.close();
        console.log('\n数据导入完成！');

    } catch (error) {
        console.error('导入数据时出错:', error);
        process.exit(1);
    }
}

importData();
