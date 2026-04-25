const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'hotel_search.db');

async function removeProvinceField() {
    const SQL = await initSqlJs();
    const fileBuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(fileBuffer);

    const result = db.exec("PRAGMA table_info(hotel_info)");
    console.log('hotel_info表结构:');
    result[0].values.forEach(row => {
        console.log(`  ${row[1]} (${row[2]})`);
    });

    const hasProvinceField = result[0].values.some(row => row[1] === 'province');
    if (hasProvinceField) {
        console.log('\n删除 province 字段...');
        db.run('ALTER TABLE hotel_info DROP COLUMN province');
        console.log('province 字段已删除');
    } else {
        console.log('\nprovince 字段已不存在，无需删除');
    }

    const newResult = db.exec("PRAGMA table_info(hotel_info)");
    console.log('\n删除后hotel_info表结构:');
    newResult[0].values.forEach(row => {
        console.log(`  ${row[1]} (${row[2]})`);
    });

    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);

    console.log('\n数据库已保存');
    process.exit(0);
}

removeProvinceField();