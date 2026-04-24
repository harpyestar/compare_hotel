/**
 * 搜索相关功能
 */
import { config, utils } from './core.js';

// 搜索功能
const searchModule = {
    // 初始化搜索功能
    init() {
        this.setupCityInput();
        this.setupHotelInput();
        this.setupGuideItems();
    },
    
    // 设置城市输入框
    setupCityInput() {
        const cityInput = document.getElementById('city');
        const suggestionsContainer = document.getElementById('citySuggestions');
        
        if (!cityInput || !suggestionsContainer) return;
        
        // 输入事件
        cityInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length > 0) {
                this.showCitySuggestions(value, suggestionsContainer);
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // 点击其他地方关闭建议
        document.addEventListener('click', (e) => {
            if (!cityInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    },
    
    // 设置酒店输入框
    setupHotelInput() {
        const hotelInput = document.getElementById('hotel');
        const suggestionsContainer = document.getElementById('hotelSuggestions');
        
        if (!hotelInput || !suggestionsContainer) return;
        
        // 输入事件
        hotelInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length > 0) {
                this.showHotelSuggestions(value, suggestionsContainer);
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // 点击其他地方关闭建议
        document.addEventListener('click', (e) => {
            if (!hotelInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    },
    
    // 显示城市搜索建议
    showCitySuggestions(value, container) {
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
                    document.getElementById('city').value = item.dataset.city;
                    container.style.display = 'none';
                });
            });
        } else {
            container.style.display = 'none';
        }
    },
    
    // 显示酒店搜索建议
    showHotelSuggestions(value, container) {
        // 这里可以添加酒店名称的建议逻辑
        // 暂时使用一个简单的示例
        const hotelSuggestions = [
            '丽思卡尔顿酒店',
            '香格里拉大酒店',
            '希尔顿酒店',
            '万豪酒店',
            '洲际酒店',
            '凯悦酒店',
            '喜来登酒店',
            '四季酒店',
            '半岛酒店'
        ].filter(hotel => hotel.toLowerCase().includes(value.toLowerCase()));
        
        if (hotelSuggestions.length > 0) {
            container.innerHTML = hotelSuggestions.map(hotel => 
                `<div class="suggestion-item p-2 hover:bg-gray-100 cursor-pointer" data-hotel="${hotel}">${hotel}</div>`
            ).join('');
            container.style.display = 'block';
            
            // 添加点击事件
            container.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('hotel').value = item.dataset.hotel;
                    container.style.display = 'none';
                });
            });
        } else {
            container.style.display = 'none';
        }
    },
    
    // 设置向导项
    setupGuideItems() {
        const guideItems = document.querySelectorAll('.city-guide-item');
        const cityInput = document.getElementById('city');
        
        if (!cityInput) return;
        
        guideItems.forEach(item => {
            item.addEventListener('click', () => {
                cityInput.value = item.textContent;
            });
        });
    },
    
    // 执行搜索
    async performSearch(city, hotel, checkIn, checkOut, guests) {
        try {
            const response = await utils.fetch('/search', {
                method: 'POST',
                body: JSON.stringify({ city, hotel, checkIn, checkOut, guests })
            });
            return response;
        } catch (error) {
            console.error('搜索失败:', error);
            return { success: false, error: error.message };
        }
    }
};

export default searchModule;