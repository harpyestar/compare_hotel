/**
 * 人数与客房数选择功能
 */
import { utils } from './core.js';

// 人数与客房数选择功能
const guestsModule = {
    // 初始化人数与客房数选择功能
    init() {
        this.setupGuestsModal();
    },
    
    // 设置人数与客房数模态框
    setupGuestsModal() {
        const guestsBtn = document.getElementById('guestsBtn');
        const guestsModal = new bootstrap.Modal(document.getElementById('guestsModal'));
        const guestsDisplay = document.getElementById('guestsDisplay');
        const adultCount = document.getElementById('adultCount');
        const childCount = document.getElementById('childCount');
        const roomCount = document.getElementById('roomCount');
        const adultMinus = document.getElementById('adultMinus');
        const adultPlus = document.getElementById('adultPlus');
        const childMinus = document.getElementById('childMinus');
        const childPlus = document.getElementById('childPlus');
        const roomMinus = document.getElementById('roomMinus');
        const roomPlus = document.getElementById('roomPlus');
        const resetGuests = document.getElementById('resetGuests');
        const applyGuests = document.getElementById('applyGuests');
        const petsAllowed = document.getElementById('petsAllowed');
        
        if (!guestsBtn || !guestsModal || !guestsDisplay || !adultCount || !childCount || !roomCount || 
            !adultMinus || !adultPlus || !childMinus || !childPlus || !roomMinus || !roomPlus || 
            !resetGuests || !applyGuests || !petsAllowed) return;
        
        // 打开模态框
        guestsBtn.addEventListener('click', function() {
            guestsModal.show();
        });
        
        // 调整成人数量
        adultMinus.addEventListener('click', function() {
            if (parseInt(adultCount.value) > 1) {
                adultCount.value = parseInt(adultCount.value) - 1;
            }
        });
        
        adultPlus.addEventListener('click', function() {
            if (parseInt(adultCount.value) < 10) {
                adultCount.value = parseInt(adultCount.value) + 1;
            }
        });
        
        // 调整小童数量
        childMinus.addEventListener('click', function() {
            if (parseInt(childCount.value) > 0) {
                childCount.value = parseInt(childCount.value) - 1;
            }
        });
        
        childPlus.addEventListener('click', function() {
            if (parseInt(childCount.value) < 10) {
                childCount.value = parseInt(childCount.value) + 1;
            }
        });
        
        // 调整客房数量
        roomMinus.addEventListener('click', function() {
            if (parseInt(roomCount.value) > 1) {
                roomCount.value = parseInt(roomCount.value) - 1;
            }
        });
        
        roomPlus.addEventListener('click', function() {
            if (parseInt(roomCount.value) < 10) {
                roomCount.value = parseInt(roomCount.value) + 1;
            }
        });
        
        // 重设
        resetGuests.addEventListener('click', function() {
            adultCount.value = 2;
            childCount.value = 0;
            roomCount.value = 1;
            petsAllowed.checked = false;
        });
        
        // 套用
        applyGuests.addEventListener('click', function() {
            const adults = parseInt(adultCount.value);
            const children = parseInt(childCount.value);
            const rooms = parseInt(roomCount.value);
            const totalGuests = adults + children;
            
            guestsDisplay.textContent = `${totalGuests}位旅客, ${rooms}间客房`;
            guestsModal.hide();
        });
    },
    
    // 获取选择的人数和客房数
    getSelectedGuests() {
        const adultCount = document.getElementById('adultCount');
        const childCount = document.getElementById('childCount');
        const roomCount = document.getElementById('roomCount');
        const petsAllowed = document.getElementById('petsAllowed');
        
        if (!adultCount || !childCount || !roomCount || !petsAllowed) return {
            adults: 2,
            children: 0,
            rooms: 1,
            pets: false
        };
        
        return {
            adults: parseInt(adultCount.value),
            children: parseInt(childCount.value),
            rooms: parseInt(roomCount.value),
            pets: petsAllowed.checked
        };
    }
};

export default guestsModule;