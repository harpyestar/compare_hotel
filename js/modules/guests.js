/**
 * 人数与客房数选择功能
 */

// 人数与客房数选择功能
const guestsModule = {
    handleOutsideClick: null,
    // 存储成人和儿童的数量以及宠物选项
    guestCounts: {
        adults: 2,
        children: 0,
        rooms: 1,
        pets: false
    },
    
    // 初始化人数与客房数选择功能
    init() {
        this.setupGuestsDropdown();
        this.initLanguageChange();
    },
    
    // 设置人数与客房数下拉框
    setupGuestsDropdown() {
        const guestsBtn = document.getElementById('guestsBtn');
        const guestsDisplay = document.getElementById('guestsDisplay');
        
        if (!guestsBtn || !guestsDisplay) return;
        
        // 打开下拉框
        guestsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openGuestsDropdown();
        });
    },
    
    // 打开人数与客房数下拉框
    openGuestsDropdown() {
        const guestsBtn = document.getElementById('guestsBtn');
        const guestsDisplay = document.getElementById('guestsDisplay');
        
        // 检查是否已经存在下拉框容器
        const existingContainer = document.getElementById('guestsDropdownContainer');
        if (existingContainer) {
            return;
        }
        
        // 创建下拉框容器
        const container = document.createElement('div');
        container.id = 'guestsDropdownContainer';
        container.style.position = 'absolute';
        container.style.top = '100%';
        container.style.left = '0';
        container.style.marginTop = '10px';
        container.style.zIndex = '10001';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #e5e5e5';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        container.style.padding = '16px';
        container.style.minWidth = '300px';
        
        // 确保下拉框容器相对于guestsBtn定位
        guestsBtn.style.position = 'relative';
        guestsBtn.appendChild(container);
        
        // 使用保存的成人、儿童、客房数量和宠物选项
        const adults = this.guestCounts.adults;
        const children = this.guestCounts.children;
        const rooms = this.guestCounts.rooms;
        const pets = this.guestCounts.pets;
        
        // 检查是否有i18next实例，获取当前语言
        let isEnglish = false;
        if (typeof i18next !== 'undefined') {
            isEnglish = i18next.language === 'en' || i18next.language === 'en-US' || i18next.language === 'en-GB';
            console.log('Current language:', i18next.language, 'Is English:', isEnglish);
        } else if (typeof window !== 'undefined' && window.t) {
            // 尝试通过t函数判断语言
            const testText = window.t('buttons.search');
            isEnglish = testText === 'Search' || testText === 'search';
            console.log('Detected language via t function:', isEnglish);
        }
        
        // 根据语言设置文本
        const adultText = isEnglish ? 'Adults' : '成人';
        const childText = isEnglish ? 'Children' : '儿童';
        const roomText = isEnglish ? 'Rooms' : '客房';
        const petsText = isEnglish ? 'Pets allowed' : '可携带宠物';
        const petsDescriptionText = isEnglish ? 'Show accommodations that welcome pets' : '显示欢迎宠物入住的住宿';
        const resetText = isEnglish ? 'Reset' : '重设';
        const applyText = isEnglish ? 'Apply' : '确定';
        
        console.log('Dropdown texts:', {
            adultText,
            childText,
            roomText,
            petsText,
            petsDescriptionText,
            resetText,
            applyText
        });
        
        // 创建人数与客房数选择内容
        container.innerHTML = `
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${adultText}</span>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="adultMinus">-</button>
                        <input type="number" class="form-control w-16 text-center mx-2" id="adultCount" value="${adults}" min="1" max="10">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="adultPlus">+</button>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${childText}</span>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="childMinus">-</button>
                        <input type="number" class="form-control w-16 text-center mx-2" id="childCount" value="${children}" min="0" max="10">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="childPlus">+</button>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <span>${roomText}</span>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="roomMinus">-</button>
                        <input type="number" class="form-control w-16 text-center mx-2" id="roomCount" value="${rooms}" min="1" max="10">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="roomPlus">+</button>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span>${petsText}</span>
                        <p class="text-sm text-muted">${petsDescriptionText}</p>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="petsAllowed" ${pets ? 'checked' : ''} style="width: 18px; height: 18px;">
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary" id="resetGuests">${resetText}</button>
                <button type="button" class="btn btn-primary" id="applyGuests" style="border-radius: 4px; padding: 6px 12px; width: auto; height: auto; display: inline-flex; align-items: center; justify-content: center;">${applyText}</button>
            </div>
        `;
        
        // 获取元素
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
            
            // 更新保存的成人、儿童、客房数量和宠物选项
            guestsModule.guestCounts = {
                adults: 2,
                children: 0,
                rooms: 1,
                pets: false
            };
        });
        
        // 确定
        applyGuests.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            
            const adults = parseInt(adultCount.value);
            const children = parseInt(childCount.value);
            const rooms = parseInt(roomCount.value);
            const pets = petsAllowed.checked;
            const totalGuests = adults + children;
            
            // 保存成人、儿童、客房数量和宠物选项
            guestsModule.guestCounts = {
                adults: adults,
                children: children,
                rooms: rooms,
                pets: pets
            };
            
            // 更新显示文本，支持语言切换
            guestsModule.updateDisplayText();
            
            // 关闭下拉框，使用getElementById获取当前容器
            const currentContainer = document.getElementById('guestsDropdownContainer');
            if (currentContainer && currentContainer.parentNode) {
                currentContainer.parentNode.removeChild(currentContainer);
            }
            
            // 清理事件监听器，确保使用捕获模式
            if (guestsModule.handleOutsideClick) {
                document.removeEventListener('click', guestsModule.handleOutsideClick, true);
                guestsModule.handleOutsideClick = null;
            }
        });
        
        // 添加点击外侧关闭的功能
        this.handleOutsideClick = (e) => {
            const currentContainer = document.getElementById('guestsDropdownContainer');
            if (!currentContainer) {
                document.removeEventListener('click', this.handleOutsideClick, true);
                this.handleOutsideClick = null;
                return;
            }
            
            // 检查点击目标是否在容器内或是否是guestsBtn
            const isClickInsideContainer = currentContainer.contains(e.target);
            const isClickOnGuestsBtn = e.target === guestsBtn || guestsBtn.contains(e.target);
            
            if (!isClickInsideContainer && !isClickOnGuestsBtn) {
                if (currentContainer.parentNode) {
                    currentContainer.parentNode.removeChild(currentContainer);
                }
                document.removeEventListener('click', this.handleOutsideClick, true);
                this.handleOutsideClick = null;
            }
        };
        
        // 立即添加事件监听器，使用捕获模式确保事件被正确捕获
        document.addEventListener('click', this.handleOutsideClick, true);
    },
    
    // 获取选择的人数和客房数
    getSelectedGuests() {
        // 从保存的状态中获取人数和客房数
        return {
            adults: this.guestCounts.adults,
            children: this.guestCounts.children,
            rooms: this.guestCounts.rooms,
            pets: this.guestCounts.pets
        };
    },
    
    // 更新显示文本，支持语言切换
    updateDisplayText() {
        const guestsDisplay = document.getElementById('guestsDisplay');
        if (!guestsDisplay) return;
        
        // 检查是否有i18next实例，获取当前语言
        let isEnglish = false;
        if (typeof i18next !== 'undefined') {
            isEnglish = i18next.language === 'en' || i18next.language === 'en-US' || i18next.language === 'en-GB';
            console.log('Current language in updateDisplayText:', i18next.language, 'Is English:', isEnglish);
        } else if (typeof window !== 'undefined' && window.t) {
            // 尝试通过t函数判断语言
            const testText = window.t('buttons.search');
            isEnglish = testText === 'Search' || testText === 'search';
            console.log('Detected language via t function in updateDisplayText:', isEnglish);
        }
        
        const adults = this.guestCounts.adults;
        const children = this.guestCounts.children;
        const rooms = this.guestCounts.rooms;
        const pets = this.guestCounts.pets;
        const totalGuests = adults + children;
        
        // 根据语言设置显示文本
        let displayText;
        if (isEnglish) {
            displayText = `${totalGuests} guests, ${rooms} rooms`;
        } else {
            displayText = `${totalGuests}位旅客, ${rooms}间客房`;
        }
        
        if (pets) {
            displayText += ' 🐶'; // 添加宠物图标作为明显标志
        }
        
        console.log('Updating display text to:', displayText);
        guestsDisplay.textContent = displayText;
    },
    
    // 初始化语言切换监听
    initLanguageChange() {
        // 检查是否有i18next实例
        if (typeof i18next !== 'undefined') {
            console.log('Initializing language change listener, current language:', i18next.language);
            // 监听语言变化事件
            i18next.on('languageChanged', (lng) => {
                console.log('Language changed to:', lng);
                this.updateDisplayText();
                // 如果下拉框是打开的，重新渲染下拉框内容
                const existingContainer = document.getElementById('guestsDropdownContainer');
                if (existingContainer) {
                    console.log('Dropdown is open, re-rendering...');
                    // 保存当前选择的值
                    const adultCount = document.getElementById('adultCount');
                    const childCount = document.getElementById('childCount');
                    const roomCount = document.getElementById('roomCount');
                    const petsAllowed = document.getElementById('petsAllowed');
                    
                    if (adultCount && childCount && roomCount && petsAllowed) {
                        // 更新保存的状态
                        this.guestCounts = {
                            adults: parseInt(adultCount.value),
                            children: parseInt(childCount.value),
                            rooms: parseInt(roomCount.value),
                            pets: petsAllowed.checked
                        };
                        
                        console.log('Saving current values:', this.guestCounts);
                        
                        // 关闭当前下拉框
                        existingContainer.parentNode.removeChild(existingContainer);
                        
                        // 重新打开下拉框，以显示新的语言文本
                        this.openGuestsDropdown();
                    }
                }
            });
        } else {
            console.log('i18next is not defined, cannot initialize language change listener');
        }
    }
};

export default guestsModule;