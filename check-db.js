const fs = require('fs');
const initSqlJs = require('sql.js');

async function checkDatabase() {
    try {
        const SQL = await initSqlJs();
        const dbPath = './data/hotel_search.db';
        
        if (fs.existsSync(dbPath)) {
            console.log('数据库文件存在');
            const fileBuffer = fs.readFileSync(dbPath);
            const db = new SQL.Database(fileBuffer);
            
            // 检查sessions表
            console.log('\n=== 检查sessions表 ===');
            const sessionsResult = db.exec('SELECT * FROM sessions');
            if (sessionsResult.length > 0 && sessionsResult[0].values.length > 0) {
                console.log('Sessions found:', sessionsResult[0].values.length);
                console.log('Session data:', sessionsResult[0].values);
            } else {
                console.log('No sessions found');
            }
            
            // 检查search_history表
            console.log('\n=== 检查search_history表 ===');
            const historyResult = db.exec('SELECT * FROM search_history');
            if (historyResult.length > 0 && historyResult[0].values.length > 0) {
                console.log('Search history found:', historyResult[0].values.length);
                console.log('History data:', historyResult[0].values);
            } else {
                console.log('No search history found');
            }
            
            db.close();
        } else {
            console.log('数据库文件不存在');
        }
    } catch (error) {
        console.error('Error checking database:', error);
    }
}

checkDatabase();