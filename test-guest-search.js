const fetch = require('node-fetch');

async function testGuestSearch() {
    try {
        // 模拟未登录用户的搜索请求
        console.log('=== 测试未登录用户搜索 ===');
        const searchResponse = await fetch('http://localhost:3000/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 不设置Authorization头，模拟未登录状态
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
        
        const searchData = await searchResponse.json();
        console.log('未登录用户保存搜索历史结果:', searchData);
        
        // 再次模拟未登录用户搜索深圳
        console.log('\n=== 测试未登录用户搜索深圳 ===');
        const shenzhenSearchResponse = await fetch('http://localhost:3000/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                destination: '深圳',
                checkIn: '2026-05-05',
                checkOut: '2026-05-07',
                type: 'city',
                city: '深圳',
                hotel: ''
            })
        });
        
        const shenzhenSearchData = await shenzhenSearchResponse.json();
        console.log('未登录用户保存深圳搜索历史结果:', shenzhenSearchData);
        
        // 获取热门城市
        console.log('\n=== 测试获取热门城市 ===');
        const citiesResponse = await fetch('http://localhost:3000/api/hot-cities');
        const citiesData = await citiesResponse.json();
        console.log('热门城市:', citiesData);
        
        console.log('\n=== 测试完成 ===');
    } catch (error) {
        console.error('测试过程中出现错误:', error);
    }
}

testGuestSearch();