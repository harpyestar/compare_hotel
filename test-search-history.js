const fetch = require('node-fetch');

async function testSearchHistory() {
    try {
        // 1. 先登录获取sessionId
        console.log('=== 测试登录 ===');
        const loginResponse = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: 'admin', password: '123' })
        });
        
        const loginData = await loginResponse.json();
        console.log('登录结果:', loginData);
        
        if (!loginData.success) {
            console.log('登录失败，无法继续测试');
            return;
        }
        
        const sessionId = loginData.sessionId;
        console.log('获取到的sessionId:', sessionId);
        
        // 2. 模拟搜索请求，保存搜索历史
        console.log('\n=== 测试保存搜索历史 ===');
        const searchResponse = await fetch('http://localhost:3000/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            },
            body: JSON.stringify({
                destination: '北京 王府井希尔顿酒店',
                checkIn: '2026-05-01',
                checkOut: '2026-05-03',
                type: 'hotel',
                city: '北京',
                hotel: '王府井希尔顿酒店'
            })
        });
        
        const searchData = await searchResponse.json();
        console.log('保存搜索历史结果:', searchData);
        
        // 3. 再次模拟一个城市搜索
        console.log('\n=== 测试保存城市搜索历史 ===');
        const citySearchResponse = await fetch('http://localhost:3000/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            },
            body: JSON.stringify({
                destination: '上海',
                checkIn: '2026-05-10',
                checkOut: '2026-05-12',
                type: 'city',
                city: '上海',
                hotel: ''
            })
        });
        
        const citySearchData = await citySearchResponse.json();
        console.log('保存城市搜索历史结果:', citySearchData);
        
        // 4. 测试保存广州的搜索历史
        console.log('\n=== 测试保存广州搜索历史 ===');
        const guangzhouSearchResponse = await fetch('http://localhost:3000/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            },
            body: JSON.stringify({
                destination: '广州',
                checkIn: '2026-05-01',
                checkOut: '2026-05-03',
                type: 'city',
                city: '广州',
                hotel: ''
            })
        });
        
        const guangzhouSearchData = await guangzhouSearchResponse.json();
        console.log('保存广州搜索历史结果:', guangzhouSearchData);
        
        // 4. 获取搜索历史
        console.log('\n=== 测试获取搜索历史 ===');
        const historyResponse = await fetch('http://localhost:3000/api/history', {
            headers: {
                'Authorization': sessionId
            }
        });
        
        const historyData = await historyResponse.json();
        console.log('获取搜索历史结果:', historyData);
        
        console.log('\n=== 测试完成 ===');
    } catch (error) {
        console.error('测试过程中出现错误:', error);
    }
}

testSearchHistory();