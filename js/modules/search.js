/**
 * 搜索相关功能
 */
import { config, utils } from './core.js';

// 搜索功能
const searchModule = {
    // 初始化搜索功能
    init() {
        this.setupSearchInput();
        this.setupGuideItems();
    },
    
    // 设置搜索输入框
    setupSearchInput() {
        const destinationInput = document.getElementById('destination');
        const suggestionsContainer = document.getElementById('suggestions');
        
        if (!destinationInput || !suggestionsContainer) return;
        
        // 输入事件
        destinationInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length > 0) {
                this.showSuggestions(value, suggestionsContainer);
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // 点击其他地方关闭建议
        document.addEventListener('click', (e) => {
            if (!destinationInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    },
    
    // 显示搜索建议
    showSuggestions(value, container) {
        const filteredCities = config.cities.filter(city => 
            city.toLowerCase().includes(value.toLowerCase())
        );
        
        if (filteredCities.length > 0) {
            container.innerHTML = filteredCities.map(city => 
                `<div class="suggestion-item p-2 hover:bg-gray-100 cursor-pointer" data-city="${city}">${city}</div>`
            ).join('');
            container.style.display = 'block';
            
            // 添加点击事件
            container.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('destination').value = item.dataset.city;
                    container.style.display = 'none';
                });
            });
        } else {
            container.style.display = 'none';
        }
    },
    
    // 设置向导项
    setupGuideItems() {
        const guideItems = document.querySelectorAll('.guide-item');
        const destinationInput = document.getElementById('destination');
        
        if (!destinationInput) return;
        
        guideItems.forEach(item => {
            item.addEventListener('click', () => {
                destinationInput.value = item.textContent;
            });
        });
    },
    
    // 执行搜索
    async performSearch(destination, checkIn, checkOut, guests) {
        try {
            const response = await utils.fetch('/search', {
                method: 'POST',
                body: JSON.stringify({ destination, checkIn, checkOut, guests })
            });
            return response;
        } catch (error) {
            console.error('搜索失败:', error);
            return { success: false, error: error.message };
        }
    }
};

export default searchModule;