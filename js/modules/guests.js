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
        
        // 创建人数与客房数选择内容
        container.innerHTML = `
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>成人</span>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="adultMinus">-</button>
                        <input type="number" class="form-control w-16 text-center mx-2" id="adultCount" value="${adults}" min="1" max="10">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="adultPlus">+</button>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>儿童</span>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="childMinus">-</button>
                        <input type="number" class="form-control w-16 text-center mx-2" id="childCount" value="${children}" min="0" max="10">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="childPlus">+</button>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <span>客房</span>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="roomMinus">-</button>
                        <input type="number" class="form-control w-16 text-center mx-2" id="roomCount" value="${rooms}" min="1" max="10">
                        <button type="button" class="btn btn-outline-primary rounded-circle w-8 h-8 d-flex align-items-center justify-content-center" id="roomPlus">+</button>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span>可携带宠物</span>
                        <p class="text-sm text-muted">显示欢迎宠物入住的住宿</p>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="petsAllowed" ${pets ? 'checked' : ''} style="width: 18px; height: 18px;">
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary" id="resetGuests">重设</button>
                <button type="button" class="btn btn-primary" id="applyGuests" style="border-radius: 4px; padding: 6px 12px; width: auto; height: auto; display: inline-flex; align-items: center; justify-content: center;">确定</button>
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
            
            // 显示旅客数量、客房数量和宠物选项
            let displayText = `${totalGuests}位旅客, ${rooms}间客房`;
            if (pets) {
                displayText += ' 🐶'; // 添加宠物图标作为明显标志
            }
            guestsDisplay.textContent = displayText;
            
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
        // 从显示文本中解析人数和客房数
        const guestsDisplay = document.getElementById('guestsDisplay');
        if (!guestsDisplay) return {
            adults: 2,
            children: 0,
            rooms: 1,
            pets: false
        };
        
        const text = guestsDisplay.textContent;
        const guestsMatch = text.match(/(\d+)位旅客/);
        const roomsMatch = text.match(/(\d+)间客房/);
        
        const totalGuests = guestsMatch ? parseInt(guestsMatch[1]) : 2;
        const rooms = roomsMatch ? parseInt(roomsMatch[1]) : 1;
        
        // 默认成人数量为总人数，儿童为0
        return {
            adults: totalGuests,
            children: 0,
            rooms: rooms,
            pets: false
        };
    }
};

export default guestsModule;