/**
 * 收藏功能
 */
import { utils } from './core.js';

// 收藏功能
const favoritesModule = {
    // 初始化收藏功能
    init() {
        this.setupFavoriteButtons();
        this.setupFavoritesModal();
    },
    
    // 设置收藏按钮
    setupFavoriteButtons() {
        const favoriteBtns = document.querySelectorAll('.favorite-btn');
        
        favoriteBtns.forEach(btn => {
            btn.addEventListener('click', async function() {
                if (!utils.isLoggedIn()) {
                    utils.showToast('请先登录！', 'error');
                    $('#loginModal').modal('show');
                    return;
                }
                
                const hotelId = this.dataset.hotelId;
                const isFavorite = this.classList.contains('active');
                
                const hotel = {
                    id: this.dataset.hotelId,
                    name: this.dataset.hotelName,
                    address: this.dataset.hotelAddress,
                    price: this.dataset.hotelPrice,
                    image: this.dataset.hotelImage
                };
                
                const response = await utils.fetch('/api/favorites', {
                    method: 'POST',
                    body: JSON.stringify(hotel)
                });
                
                if (response.success) {
                    this.classList.toggle('active');
                    this.style.color = isFavorite ? '#ccc' : '#dc3545';
                    utils.showToast(isFavorite ? '已取消收藏' : '收藏成功！');
                } else {
                    utils.showToast('操作失败：' + response.error, 'error');
                }
            });
        });
    },
    
    // 设置收藏模态框
    setupFavoritesModal() {
        const favoritesBtn = document.getElementById('favoritesBtn');
        if (!favoritesBtn) return;
        
        favoritesBtn.addEventListener('click', async function() {
            if (!utils.isLoggedIn()) {
                utils.showToast('请先登录！', 'error');
                $('#loginModal').modal('show');
                return;
            }
            
            const response = await utils.fetch('/api/favorites');
            
            if (response.success) {
                const favoritesList = document.getElementById('favoritesList');
                if (favoritesList) {
                    if (response.favorites.length === 0) {
                        favoritesList.innerHTML = '<p class="text-center">暂无收藏酒店</p>';
                    } else {
                        favoritesList.innerHTML = response.favorites.map(hotel => `
                            <div class="col-md-4">
                                <div class="hotel-card">
                                    <div class="hotel-image">
                                        <img src="${hotel.image}" alt="${hotel.name}">
                                    </div>
                                    <div class="hotel-info">
                                        <h3 class="hotel-name">${hotel.name}</h3>
                                        <p class="hotel-location"><i class="fas fa-map-marker-alt"></i> ${hotel.address}</p>
                                        <div class="hotel-price">¥${hotel.price}/晚</div>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                }
                $('#favoritesModal').modal('show');
            } else {
                utils.showToast('获取收藏失败：' + response.error, 'error');
            }
        });
    }
};

export default favoritesModule;