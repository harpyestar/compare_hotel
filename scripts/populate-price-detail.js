const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function randomPrice(min = 300, max = 2500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRating(min = 3.0, max = 5.0) {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function randomPlatform() {
    const platforms = ['携程', '美团', '飞猪'];
    return platforms[Math.floor(Math.random() * platforms.length)];
}

async function populatePriceDetail() {
    try {
        const SQL = await initSqlJs();
        const dbPath = path.join(__dirname, '..', 'data', 'hotel_search.db');
        const fileBuffer = fs.readFileSync(dbPath);
        const db = new SQL.Database(fileBuffer);

        console.log('开始填充price_detail表...');

        const cityResult = db.exec('SELECT city_name, city_latitude, city_longitude FROM city');
        const cityCenterMap = {};
        if (cityResult.length > 0 && cityResult[0].values.length > 0) {
            cityResult[0].values.forEach(row => {
                cityCenterMap[row[0]] = { lat: row[1], lng: row[2] };
            });
        }
        console.log(`加载了 ${Object.keys(cityCenterMap).length} 个城市的中心坐标`);

        db.run('DELETE FROM price_detail');
        console.log('已清空price_detail表');

        const hotelResult = db.exec('SELECT hotel_id, city_name, lng_baidu, lat_baidu FROM hotel_info');
        if (hotelResult.length === 0 || hotelResult[0].values.length === 0) {
            console.log('没有找到酒店数据');
            return;
        }

        const hotels = hotelResult[0].values;
        console.log(`找到 ${hotels.length} 家酒店`);

        const platforms = ['携程', '美团', '飞猪'];
        let insertCount = 0;
        let batchSize = 1000;
        let batchCount = 0;

        for (const hotel of hotels) {
            const hotelId = hotel[0];
            const cityName = hotel[1];
            const hotelLng = parseFloat(hotel[2]);
            const hotelLat = parseFloat(hotel[3]);

            if (!hotelLng || !hotelLat || isNaN(hotelLng) || isNaN(hotelLat)) {
                continue;
            }

            const cityCenter = cityCenterMap[cityName];
            let distance = 0;
            if (cityCenter) {
                distance = calculateDistance(hotelLat, hotelLng, cityCenter.lat, cityCenter.lng);
                distance = Math.round(distance * 100) / 100;
            }

            const numPlatforms = Math.floor(Math.random() * 3) + 1;
            const selectedPlatforms = platforms.sort(() => Math.random() - 0.5).slice(0, numPlatforms);

            for (const platform of selectedPlatforms) {
                const price = randomPrice();
                const rating = randomRating();

                db.run('INSERT INTO price_detail (hotel_id, platform, price, distance, rating) VALUES (?, ?, ?, ?, ?)',
                    [hotelId, platform, price, distance, rating]);
                insertCount++;
            }

            batchCount++;
            if (batchCount >= batchSize) {
                console.log(`已处理 ${batchCount} 家酒店...`);
                batchCount = 0;
            }
        }

        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);

        console.log(`price_detail数据填充完成，共插入 ${insertCount} 条记录`);

        const verifyResult = db.exec('SELECT COUNT(*) as count FROM price_detail');
        console.log(`验证: price_detail表共有 ${verifyResult[0].values[0][0]} 条记录`);

        const sampleResult = db.exec('SELECT * FROM price_detail LIMIT 5');
        console.log('示例数据:', sampleResult[0].values);

        db.close();
        console.log('数据库已保存');

    } catch (error) {
        console.error('填充price_detail表时出错:', error);
        process.exit(1);
    }
}

populatePriceDetail();