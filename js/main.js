/**
 * 主入口文件
 */
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import searchModule from './modules/search.js';
import datepickerModule from './modules/datepicker.js';
import guestsModule from './modules/guests.js';
import userModule from './modules/user.js';
import favoritesModule from './modules/favorites.js';
import guideModule from './modules/guide.js';

// 初始化i18next
i18next
  .use(Backend)
  .use(LanguageDetector)
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
            
            // 初始更新页面文本
            updatePageText();
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
    // 更新页面标题
    document.getElementById('pageTitle').textContent = t('header.title');
    
    // 更新搜索框占位符
    const destinationInput = document.getElementById('destination');
    if (destinationInput) {
        destinationInput.placeholder = t('header.searchPlaceholder');
    }
    
    // 更新日期选择按钮
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        dateDisplay.textContent = t('header.selectDate');
    }
    
    // 更新旅客选择按钮
    const guestsDisplay = document.getElementById('guestsDisplay');
    if (guestsDisplay) {
        guestsDisplay.textContent = t('header.travelers');
    }
    
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
    
    // 更新语言下拉菜单
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
        languageDropdown.innerHTML = `<i class="fas fa-globe mr-1"></i> ${t('buttons.language')}`;
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
});