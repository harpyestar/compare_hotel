// 图片配置文件
const imageConfig = {
    // 酒店图片 - 预定义35张不同风格的酒店图片
    hotelImages: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
    ],

    // 城市图片 - 预定义20个城市的风景图片
    cityImages: {
        '北京': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
        '上海': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop',
        '广州': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
        '深圳': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
        '杭州': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '成都': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&h=600&fit=crop',
        '重庆': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop',
        '三亚': 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop',
        '西安': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
        '南京': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop',
        '苏州': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '武汉': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
        '厦门': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
        '青岛': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '大连': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
        '昆明': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '丽江': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
        '桂林': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '拉萨': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
        '香港': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop',
        '澳门': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop',
        '天津': 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop',
        '长沙': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '福州': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
        '济南': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '哈尔滨': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop',
        '乌鲁木齐': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '银川': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
        '西宁': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop',
        '南宁': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
        '贵阳': 'https://images.unsplash.com/photo-1520625236294-944d38e63796?w=800&h=600&fit=crop'
    },

    // 默认城市图片（当没有匹配的城市时使用）
    defaultCityImages: [
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop'
    ]
};

// 获取酒店图片（轮询使用）
function getHotelImage(index) {
    return imageConfig.hotelImages[index % imageConfig.hotelImages.length];
}

// 获取城市图片（优先使用匹配的，否则使用默认的）
function getCityImage(cityName, index) {
    // 先尝试从预定义的城市图片中获取
    if (imageConfig.cityImages[cityName]) {
        return imageConfig.cityImages[cityName];
    }
    // 如果没有匹配的，使用默认图片轮询
    return imageConfig.defaultCityImages[index % imageConfig.defaultCityImages.length];
}