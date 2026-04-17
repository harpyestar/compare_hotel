/**
 * 主入口文件
 */
import searchModule from './modules/search.js';
import datepickerModule from './modules/datepicker.js';
import guestsModule from './modules/guests.js';
import userModule from './modules/user.js';
import favoritesModule from './modules/favorites.js';
import guideModule from './modules/guide.js';

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