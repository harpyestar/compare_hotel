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