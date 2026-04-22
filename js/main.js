/**
 * 主入口文件
 */
// 使用CDN加载的i18next
// 导入模块
import searchModule from './modules/search.js';
import datepickerModule from './modules/datepicker.js';
import guestsModule from './modules/guests.js';
import userModule from './modules/user.js';
import favoritesModule from './modules/favorites.js';
import guideModule from './modules/guide.js';

// 初始化i18next
i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'zh-CN',
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}.json'
    }
  });

// 全局翻译函数
window.t = function(key, options) {
  return i18next.t(key, options);
};

// 语言切换函数
window.changeLanguage = function(lang) {
  return i18next.changeLanguage(lang);
};

// 页面加载完成后初始化所有模块
document.addEventListener('DOMContentLoaded', function() {
    // 加载组件
    Promise.all([
        fetch('components/header.html').then(response => response.text()),
        fetch('components/search.html').then(response => response.text()),
        fetch('components/modal.html').then(response => response.text()),
        fetch('components/footer.html').then(response => response.text())
    ]).then(([headerHtml, searchHtml, modalHtml, footerHtml]) => {
        // 渲染组件
        document.getElementById('header').innerHTML = headerHtml;
        document.getElementById('search').innerHTML = searchHtml;
        document.getElementById('modals').innerHTML = modalHtml;
        document.getElementById('footer').innerHTML = footerHtml;
        
        // 组件加载完成后初始化所有模块
        setTimeout(() => {
            // 初始化搜索功能
            searchModule.init();
            
            // 初始化日期选择功能
            datepickerModule.init();
            
            // 初始化人数与客房数选择功能
            guestsModule.init();
            
            // 初始化用户认证功能
            userModule.init();
            
            // 初始化收藏功能
            favoritesModule.init();
            
            // 初始化向导功能
            guideModule.init();
            
            // 初始化比较酒店功能
            initCompareHotels();
            
            // 初始化语言切换功能
            initLanguageSwitch();
            
            // 初始化查看详情功能
            initViewDetails();
            
            // 初始化搜索选项切换功能
            initSearchOptions();
            
            // 初始化搜索表单提交
            initSearchForm();
            
            // 初始化热门搜索数据
            initHotSearches();
            
            // 初始更新页面文本
            updatePageText();
            // 初始更新人数与客房数显示文本
            guestsModule.updateDisplayText();
            // 初始更新日期选择显示文本
            datepickerModule.updateDisplayText();
        }, 100);
    });
});

// 比较酒店功能
function initCompareHotels() {
    const compareBtn = document.querySelector('.compare-btn');
    const checkboxes = document.querySelectorAll('.compare-checkbox input');
    
    if (!compareBtn || !checkboxes.length) return;
    
    // 监听复选框变化
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCompareBtn);
    });
    
    // 更新比较按钮状态
    function updateCompareBtn() {
        const checkedCount = document.querySelectorAll('.compare-checkbox input:checked').length;
        compareBtn.disabled = checkedCount < 2;
        compareBtn.textContent = `比较(${checkedCount})`;
    }
    
    // 初始更新
    updateCompareBtn();
    
    // 比较按钮点击事件
    compareBtn.addEventListener('click', function() {
        const checkedHotels = [];
        document.querySelectorAll('.compare-checkbox input:checked').forEach(checkbox => {
            const hotelCard = checkbox.closest('.hotel-card');
            if (hotelCard) {
                checkedHotels.push({
                    name: hotelCard.querySelector('.hotel-name').textContent,
                    price: hotelCard.querySelector('.hotel-price').textContent,
                    rating: hotelCard.querySelector('.rating-score').textContent,
                    location: hotelCard.querySelector('.hotel-location').textContent
                });
            }
        });
        
        if (checkedHotels.length >= 2) {
            alert('比较功能开发中，敬请期待！');
        }
    });
}

// 查看详情功能
function initViewDetails() {
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    
    if (!viewDetailsBtns.length) return;
    
    // 为每个查看详情按钮添加点击事件
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取酒店卡片
            const hotelCard = this.closest('.hotel-card');
            if (!hotelCard) return;
            
            // 获取酒店信息
            const hotelName = hotelCard.querySelector('.hotel-name').textContent;
            const hotelAddress = hotelCard.querySelector('.hotel-address').textContent;
            const hotelPrice = hotelCard.querySelector('.hotel-price').textContent.replace(/[^0-9]/g, '');
            const hotelImage = hotelCard.querySelector('.hotel-image img').src;
            const hotelId = hotelCard.querySelector('.favorite-btn').getAttribute('data-hotel-id');
            
            // 构建详情页URL
            const detailUrl = `hotel-detail.html?id=${hotelId}&name=${encodeURIComponent(hotelName)}&address=${encodeURIComponent(hotelAddress)}&price=${hotelPrice}&image=${encodeURIComponent(hotelImage)}`;
            
            // 在新标签页中打开详情页
            window.open(detailUrl, '_blank');
        });
    });
}

// 搜索选项切换功能
function initSearchOptions() {
    const searchByHotelBtn = document.getElementById('searchByHotel');
    const searchByCityBtn = document.getElementById('searchByCity');
    const hotelList = document.getElementById('hotelList');
    const cityList = document.getElementById('cityList');
    const searchTypeInput = document.getElementById('searchType');
    
    if (!searchByHotelBtn || !searchByCityBtn || !hotelList || !cityList) return;
    
    // 为搜索选项按钮添加点击事件
    searchByHotelBtn.addEventListener('click', function() {
        searchByHotelBtn.classList.add('active');
        searchByCityBtn.classList.remove('active');
        hotelList.style.display = 'flex';
        cityList.style.display = 'none';
        if (searchTypeInput) {
            searchTypeInput.value = 'hotel';
        }
    });
    
    searchByCityBtn.addEventListener('click', function() {
        searchByCityBtn.classList.add('active');
        searchByHotelBtn.classList.remove('active');
        hotelList.style.display = 'none';
        cityList.style.display = 'flex';
        if (searchTypeInput) {
            searchTypeInput.value = 'city';
        }
    });
}

// 初始化搜索表单提交
function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const destinationInput = document.getElementById('destination');
    const dateDisplay = document.getElementById('dateDisplay');
    const guestsDisplay = document.getElementById('guestsDisplay');
    const searchTypeInput = document.getElementById('searchType');
    
    if (!searchForm || !destinationInput || !dateDisplay || !guestsDisplay) return;
    
    // 处理搜索表单提交
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const destination = destinationInput.value.trim();
        const dateText = dateDisplay.textContent.trim();
        const guestsText = guestsDisplay.textContent.trim();
        
        // 自动判断搜索类型
        let searchType = searchTypeInput ? searchTypeInput.value : 'city';
        console.log('Initial searchType:', searchType);
        console.log('Destination:', destination);
        
        // 根据输入内容自动判断是城市还是酒店
        // 检查是否包含酒店相关关键词
        if (destination.includes('酒店') || destination.includes('饭店') || destination.includes('宾馆') || 
            destination.includes('Hotel') || destination.includes('Motel') || destination.includes('Inn') ||
            destination.includes('Resort') || destination.includes('Suite') || destination.includes('Villa')) {
            searchType = 'hotel';
            // 更新搜索类型输入框的值
            if (searchTypeInput) {
                searchTypeInput.value = 'hotel';
            }
            console.log('Updated searchType to hotel');
        } 
        // 检查是否是已知的酒店名称
        else if (destination.includes('丽思卡尔顿') || destination.includes('香格里拉') || destination.includes('希尔顿') ||
                 destination.includes('万豪') || destination.includes('洲际') || destination.includes('凯悦') ||
                 destination.includes('喜来登') || destination.includes('四季') || destination.includes('半岛')) {
            searchType = 'hotel';
            // 更新搜索类型输入框的值
            if (searchTypeInput) {
                searchTypeInput.value = 'hotel';
            }
            console.log('Updated searchType to hotel (known hotel chain)');
        } 
        // 特别处理"上海大酒店"等情况
        else if (destination.includes('大酒店')) {
            searchType = 'hotel';
            // 更新搜索类型输入框的值
            if (searchTypeInput) {
                searchTypeInput.value = 'hotel';
            }
            console.log('Updated searchType to hotel (contains "大酒店")');
        } else {
            // 默认为城市类型
            searchType = 'city';
            // 更新搜索类型输入框的值
            if (searchTypeInput) {
                searchTypeInput.value = 'city';
            }
            console.log('Updated searchType to city');
        }
        
        console.log('Final searchType:', searchType);
        
        if (!destination) {
            alert('请输入目的地');
            return;
        }
        
        if (dateText === '选择日期') {
            alert('请选择日期');
            return;
        }
        
        // 解析日期
        let checkIn, checkOut;
        console.log('Date text:', dateText);
        
        // 检查是否是中文格式: 2026年4月21日 - 2026年4月22日
        const chineseDateMatch = dateText.match(/(\d+)年(\d+)月(\d+)日\s*-\s*(\d+)年(\d+)月(\d+)日/);
        if (chineseDateMatch) {
            checkIn = `${chineseDateMatch[1]}-${String(chineseDateMatch[2]).padStart(2, '0')}-${String(chineseDateMatch[3]).padStart(2, '0')}`;
            checkOut = `${chineseDateMatch[4]}-${String(chineseDateMatch[5]).padStart(2, '0')}-${String(chineseDateMatch[6]).padStart(2, '0')}`;
        } 
        // 检查是否是英文格式: 2026/4/21 - 2026/4/22
        else if (dateText.includes('/')) {
            const englishDateMatch = dateText.match(/(\d+)\/(\d+)\/(\d+)\s*-\s*(\d+)\/(\d+)\/(\d+)/);
            if (englishDateMatch) {
                checkIn = `${englishDateMatch[1]}-${String(englishDateMatch[2]).padStart(2, '0')}-${String(englishDateMatch[3]).padStart(2, '0')}`;
                checkOut = `${englishDateMatch[4]}-${String(englishDateMatch[5]).padStart(2, '0')}-${String(englishDateMatch[6]).padStart(2, '0')}`;
            } else {
                alert('日期格式不正确');
                return;
            }
        } 
        // 检查是否是旧的中文格式: 4月21日 - 4月22日
        else if (dateText.includes('月') && dateText.includes('日')) {
            const oldChineseDateMatch = dateText.match(/(\d+)月(\d+)日\s*-\s*(\d+)月(\d+)日/);
            if (oldChineseDateMatch) {
                const now = new Date();
                const year = now.getFullYear();
                checkIn = `${year}-${String(oldChineseDateMatch[1]).padStart(2, '0')}-${String(oldChineseDateMatch[2]).padStart(2, '0')}`;
                checkOut = `${year}-${String(oldChineseDateMatch[3]).padStart(2, '0')}-${String(oldChineseDateMatch[4]).padStart(2, '0')}`;
            } else {
                alert('日期格式不正确');
                return;
            }
        } else {
            alert('日期格式不正确');
            return;
        }
        
        // 解析城市和酒店信息
        let city = null;
        let hotel = null;
        
        // 根据搜索类型和内容解析
        if (searchType === 'city') {
            city = destination;
        } else if (searchType === 'hotel') {
            hotel = destination;
            // 尝试从酒店名称中提取城市
            const cityMatch = destination.match(/^(北京|上海|广州|深圳|杭州|成都|重庆|三亚)/);
            if (cityMatch) {
                city = cityMatch[1];
            }
        }
        
        // 保存搜索历史
        console.log('Saving search history with type:', searchType);
        try {
            // 确保searchType有值
            const finalType = searchType || 'city';
            console.log('Final type to send to server:', finalType);
            
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('sessionId')
                },
                body: JSON.stringify({ destination, checkIn, checkOut, type: finalType, city, hotel })
            });
            
            const result = await response.json();
            console.log('Save history result:', result);
            if (!result.success && result.message === '登录后才能保存搜索历史') {
                // 未登录，不影响搜索
                console.log('Not logged in, search history not saved');
            }
        } catch (error) {
            console.error('保存搜索历史失败:', error);
        }
        
        // 执行搜索
        alert(`搜索: ${destination}, 日期: ${checkIn} 至 ${checkOut}, 类型: ${searchType}`);
        // 这里可以添加实际的搜索逻辑
    });
}

// 初始化热门搜索数据
async function initHotSearches() {
    try {
        // 获取热门城市搜索
        const citiesResponse = await fetch('/api/hot-cities');
        const citiesData = await citiesResponse.json();
        
        // 获取热门酒店搜索
        const hotelsResponse = await fetch('/api/hot-hotels');
        const hotelsData = await hotelsResponse.json();
        
        // 更新热门酒店列表
        updateHotelList(hotelsData.success ? hotelsData.hotels : []);
        
        // 更新城市列表
        updateCityList(citiesData.success ? citiesData.cities : []);
        
    } catch (error) {
        console.error('获取热门搜索数据失败:', error);
        // 显示空状态
        updateHotelList([]);
        updateCityList([]);
    }
}

// 更新酒店列表
function updateHotelList(hotels) {
    const hotelList = document.getElementById('hotelList');
    if (!hotelList) return;
    
    if (hotels.length > 0) {
        // 生成酒店列表
        let hotelHTML = '';
        hotels.forEach((hotel, index) => {
            hotelHTML += `
                <div class="col-md-4">
                    <div class="hotel-card">
                        <div class="compare-checkbox">
                            <input type="checkbox" class="form-check-input" id="hotel${index + 1}">
                        </div>
                        <div class="hotel-image">
                            <img src="https://via.placeholder.com/400x300?text=${encodeURIComponent(hotel.name)}" alt="${hotel.name}">
                            <div class="hotel-rating">4.5</div>
                        </div>
                        <div class="hotel-info">
                            <div class="d-flex justify-content-between align-items-start">
                                <h3 class="hotel-name">${hotel.name}</h3>
                                <button class="btn btn-sm btn-outline-danger favorite-btn" data-hotel-id="${index + 1}" data-hotel-name="${hotel.name}" data-hotel-address="" data-hotel-price="0" data-hotel-image="https://via.placeholder.com/400x300?text=${encodeURIComponent(hotel.name)}">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                            <p class="hotel-address">搜索次数: ${hotel.count}</p>
                            <div class="hotel-price">热门指数: ${hotel.count}</div>
                            <button class="btn btn-sm btn-outline-primary view-details-btn">查看详情</button>
                        </div>
                    </div>
                </div>
            `;
        });
        hotelList.innerHTML = hotelHTML;
    } else {
        // 显示空状态
        hotelList.innerHTML = `
            <div class="col-md-12 text-center py-10">
                <p class="text-muted">暂无热门酒店搜索数据</p>
            </div>
        `;
    }
    
    // 重新初始化查看详情功能
    initViewDetails();
}

// 更新城市列表
function updateCityList(cities) {
    const cityList = document.getElementById('cityList');
    if (!cityList) return;
    
    if (cities.length > 0) {
        // 生成城市列表
        let cityHTML = `
            <div class="col-md-12">
                <div class="city-grid">
        `;
        cities.forEach((city, index) => {
            cityHTML += `
                <div class="city-item">
                    <img src="https://via.placeholder.com/200x150?text=${encodeURIComponent(city.name)}" alt="${city.name}">
                    <h4>${city.name}</h4>
                    <p class="text-sm text-muted">搜索次数: ${city.count}</p>
                </div>
            `;
        });
        cityHTML += `
                </div>
            </div>
        `;
        cityList.innerHTML = cityHTML;
    } else {
        // 显示空状态
        cityList.innerHTML = `
            <div class="col-md-12 text-center py-10">
                <p class="text-muted">暂无热门城市搜索数据</p>
            </div>
        `;
    }
}

// 初始化语言切换功能
function initLanguageSwitch() {
    // 为语言下拉菜单添加点击事件
    document.querySelectorAll('[data-lang]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang).then(() => {
                updatePageText();
            });
        });
    });
}

// 更新页面文本
function updatePageText() {
    // 清理日历实例，以便在打开时使用新的语言
    if (typeof datepickerModule !== 'undefined' && datepickerModule.cleanup) {
        datepickerModule.cleanup();
    }
    
    // 更新页面标题
    document.getElementById('pageTitle').textContent = t('header.title');
    
    // 更新搜索框占位符
    const destinationInput = document.getElementById('destination');
    if (destinationInput) {
        destinationInput.placeholder = t('header.searchPlaceholder');
    }
    
    // 更新日期选择按钮 - 只在显示默认文本时更新
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        const defaultText = t('header.selectDate');
        // 只有当日期显示的是默认文本时才更新，避免重置用户已选择的日期
        if (dateDisplay.textContent === defaultText || dateDisplay.textContent === window.t('header.selectDate')) {
            dateDisplay.textContent = defaultText;
        }
    }
    
    // 旅客选择按钮由guestsModule.updateDisplayText()处理，不需要在这里更新
    
    // 更新登录/注册按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = t('buttons.login');
    }
    
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.textContent = t('buttons.register');
    }
    
    // 更新用户信息区域按钮
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.textContent = t('buttons.history');
    }
    
    const favoritesBtn = document.getElementById('favoritesBtn');
    if (favoritesBtn) {
        favoritesBtn.textContent = t('buttons.favorite');
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.textContent = t('buttons.logout');
    }
    
    // 更新语言下拉菜单，显示当前选中的语言
    const getCurrentLanguageName = () => {
        const lang = i18next.language;
        if (lang === 'zh-CN') return '中文';
        if (lang === 'en-US') return 'English';
        return t('buttons.language');
    };
    
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
        languageDropdown.innerHTML = `<i class="fas fa-globe mr-1"></i> ${getCurrentLanguageName()}`;
    }
    
    const languageDropdownUser = document.getElementById('languageDropdownUser');
    if (languageDropdownUser) {
        languageDropdownUser.innerHTML = `<i class="fas fa-globe mr-1"></i> ${getCurrentLanguageName()}`;
    }
    
    // 更新页面标题和副标题
    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) {
        headerTitle.textContent = t('header.title');
    }
    
    const headerSubtitle = document.getElementById('headerSubtitle');
    if (headerSubtitle) {
        headerSubtitle.textContent = t('header.subtitle');
    }
    
    // 更新步骤指示器
    const step1 = document.getElementById('step1');
    if (step1) {
        step1.textContent = t('header.step1');
    }
    
    const step2 = document.getElementById('step2');
    if (step2) {
        step2.textContent = t('header.step2');
    }
    
    const step3 = document.getElementById('step3');
    if (step3) {
        step3.textContent = t('header.step3');
    }
    
    const step4 = document.getElementById('step4');
    if (step4) {
        step4.textContent = t('header.step4');
    }
    
    // 更新热门目的地
    const hotDestinationsTitle = document.getElementById('hotDestinationsTitle');
    if (hotDestinationsTitle) {
        hotDestinationsTitle.textContent = t('search.hotDestinations');
    }
    
    // 更新热门搜索酒店
    const hotelsTitle = document.getElementById('hotelsTitle');
    if (hotelsTitle) {
        hotelsTitle.textContent = t('hotels.title');
    }
    
    const hotelsSubtitle = document.getElementById('hotelsSubtitle');
    if (hotelsSubtitle) {
        hotelsSubtitle.textContent = t('hotels.subtitle');
    }
    
    const hotSearchTitle = document.getElementById('hotSearchTitle');
    if (hotSearchTitle) {
        hotSearchTitle.textContent = t('hotels.hotSearch');
    }
    
    // 更新合作平台
    const platformsTitle = document.getElementById('platformsTitle');
    if (platformsTitle) {
        platformsTitle.textContent = t('platforms.title');
    }
    
    // 更新查看详情按钮
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    viewDetailsBtns.forEach(btn => {
        btn.textContent = t('buttons.viewDetails');
    });
    
    // 更新向导
    const guideTitle = document.getElementById('guideTitle');
    if (guideTitle) {
        guideTitle.textContent = t('guide.title');
    }
    
    const guideContent = document.getElementById('guideContent');
    if (guideContent) {
        guideContent.textContent = t('guide.intro');
    }
    
    const guideClose = document.getElementById('guideClose');
    if (guideClose) {
        guideClose.textContent = t('buttons.close');
    }
    
    const guidePrev = document.getElementById('guidePrev');
    if (guidePrev) {
        guidePrev.textContent = t('buttons.prev');
    }
    
    const guideNext = document.getElementById('guideNext');
    if (guideNext) {
        guideNext.textContent = t('buttons.next');
    }
    
    // 更新人数与客房数目弹窗
    const guestsModalLabel = document.getElementById('guestsModalLabel');
    if (guestsModalLabel) {
        guestsModalLabel.textContent = t('guests.title');
    }
    
    const adultLabel = document.getElementById('adultLabel');
    if (adultLabel) {
        adultLabel.textContent = t('guests.adult');
    }
    
    const childLabel = document.getElementById('childLabel');
    if (childLabel) {
        childLabel.textContent = t('guests.child');
    }
    
    const roomLabel = document.getElementById('roomLabel');
    if (roomLabel) {
        roomLabel.textContent = t('guests.room');
    }
    
    const petsLabel = document.getElementById('petsLabel');
    if (petsLabel) {
        petsLabel.textContent = t('guests.pets');
    }
    
    const petsDescription = document.getElementById('petsDescription');
    if (petsDescription) {
        petsDescription.textContent = t('guests.petsDescription');
    }
    
    const resetGuests = document.getElementById('resetGuests');
    if (resetGuests) {
        resetGuests.textContent = t('guests.reset');
    }
    
    const applyGuests = document.getElementById('applyGuests');
    if (applyGuests) {
        applyGuests.textContent = t('guests.apply');
    }
    
    // 更新登录模态框
    const loginModalLabel = document.getElementById('loginModalLabel');
    if (loginModalLabel) {
        loginModalLabel.textContent = t('login.title');
    }
    
    const loginUsernameLabel = document.querySelector('label[for="loginUsername"]');
    if (loginUsernameLabel) {
        loginUsernameLabel.textContent = t('login.username');
    }
    
    const loginPasswordLabel = document.querySelector('label[for="loginPassword"]');
    if (loginPasswordLabel) {
        loginPasswordLabel.textContent = t('login.password');
    }
    
    const loginSubmitBtn = document.querySelector('#loginForm button[type="submit"]');
    if (loginSubmitBtn) {
        loginSubmitBtn.textContent = t('login.submit');
    }
    
    // 更新注册模态框
    const registerModalLabel = document.getElementById('registerModalLabel');
    if (registerModalLabel) {
        registerModalLabel.textContent = t('register.title');
    }
    
    const registerUsernameLabel = document.querySelector('label[for="registerUsername"]');
    if (registerUsernameLabel) {
        registerUsernameLabel.textContent = t('register.username');
    }
    
    const registerPasswordLabel = document.querySelector('label[for="registerPassword"]');
    if (registerPasswordLabel) {
        registerPasswordLabel.textContent = t('register.password');
    }
    
    const registerConfirmPasswordLabel = document.querySelector('label[for="registerConfirmPassword"]');
    if (registerConfirmPasswordLabel) {
        registerConfirmPasswordLabel.textContent = t('register.confirmPassword');
    }
    
    const registerSubmitBtn = document.querySelector('#registerForm button[type="submit"]');
    if (registerSubmitBtn) {
        registerSubmitBtn.textContent = t('register.submit');
    }
    
    // 更新比较按钮
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        compareBtn.innerHTML = `<i class="fas fa-balance-scale mr-2"></i> ${t('buttons.compare')} (0)`;
    }
}

// 监听语言变化事件
i18next.on('languageChanged', function(lng) {
    updatePageText();
    // 更新人数与客房数显示文本
    guestsModule.updateDisplayText();
    // 更新日期选择显示文本
    datepickerModule.updateDisplayText();
});