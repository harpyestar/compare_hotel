const initSqlJs = require('sql.js');
const fs = require('fs');

async function verifyData() {
    const SQL = await initSqlJs();
    const fileBuffer = fs.readFileSync('./data/hotel_search.db');
    const db = new SQL.Database(fileBuffer);

    console.log('=== 验证数据 ===\n');

    const cityCount = db.exec('SELECT COUNT(*) as count FROM city');
    console.log('city表城市数量:', cityCount[0].values[0][0]);

    const unmatchedCount = db.exec('SELECT COUNT(DISTINCT h.city_name) FROM hotel_info h LEFT JOIN city c ON h.city_name = c.city_name WHERE h.city_name IS NOT NULL AND c.city_id IS NULL');
    console.log('未匹配城市数量:', unmatchedCount[0].values[0][0]);

    const hotel = db.exec("SELECT hotel_id, city_name, lng_baidu, lat_baidu FROM hotel_info WHERE hotel_id = '147987'");
    console.log('\n酒店147987信息:', hotel[0].values[0]);

    const cityCenter = db.exec("SELECT city_latitude, city_longitude FROM city WHERE city_name = '无锡'");
    console.log('无锡城市中心:', cityCenter[0].values[0]);

    const priceDetail = db.exec("SELECT platform, price, distance, rating FROM price_detail WHERE hotel_id = '147987'");
    console.log('价格详情:', priceDetail[0].values);

    const stats = db.exec("SELECT platform, COUNT(platform) as count FROM price_detail GROUP BY platform");
    console.log('\n平台分布:', stats[0].values);

    const priceStats = db.exec("SELECT MIN(price), MAX(price), AVG(price) FROM price_detail");
    console.log('价格范围:', priceStats[0].values);

    const distanceStats = db.exec("SELECT MIN(distance), MAX(distance), AVG(distance) FROM price_detail");
    console.log('距离范围(km):', distanceStats[0].values);

    const ratingStats = db.exec("SELECT MIN(rating), MAX(rating), AVG(rating) FROM price_detail");
    console.log('评分范围:', ratingStats[0].values);

    const totalRecords = db.exec("SELECT COUNT(*) FROM price_detail");
    console.log('总记录数:', totalRecords[0].values[0][0]);

    db.close();
}

verifyData();