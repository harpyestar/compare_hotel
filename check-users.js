const fs = require('fs');
const initSqlJs = require('sql.js');

async function checkUsers() {
    try {
        const SQL = await initSqlJs();
        const dbPath = './data/hotel_search.db';
        
        if (fs.existsSync(dbPath)) {
            console.log('数据库文件存在');
            const fileBuffer = fs.readFileSync(dbPath);
            const db = new SQL.Database(fileBuffer);
            
            // 检查users表
            console.log('\n=== 检查users表 ===');
            const usersResult = db.exec('SELECT * FROM users');
            if (usersResult.length > 0 && usersResult[0].values.length > 0) {
                console.log('Users found:', usersResult[0].values.length);
                console.log('User data:', usersResult[0].values);
            } else {
                console.log('No users found');
            }
            
            db.close();
        } else {
            console.log('数据库文件不存在');
        }
    } catch (error) {
        console.error('Error checking database:', error);
    }
}

checkUsers();