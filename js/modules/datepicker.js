/**
 * 日期选择功能
 */
import { utils } from './core.js';

// 日期选择功能
const datepickerModule = {
    // 初始化日期选择功能
    init() {
        this.setupDateModal();
    },
    
    // 设置日期模态框
    setupDateModal() {
        const dateBtn = document.getElementById('dateBtn');
        const dateModal = new bootstrap.Modal(document.getElementById('dateModal'));
        const dateDisplay = document.getElementById('dateDisplay');
        const checkIn = document.getElementById('check-in');
        const checkOut = document.getElementById('check-out');
        const resetDate = document.getElementById('resetDate');
        const applyDate = document.getElementById('applyDate');
        
        if (!dateBtn || !dateModal || !dateDisplay || !checkIn || !checkOut || !resetDate || !applyDate) return;
        
        // 打开日期模态框
        dateBtn.addEventListener('click', function() {
            dateModal.show();
        });
        
        // 重设日期
        resetDate.addEventListener('click', function() {
            checkIn.value = '';
            checkOut.value = '';
        });
        
        // 应用日期
        applyDate.addEventListener('click', function() {
            if (checkIn.value && checkOut.value) {
                // 格式化日期显示
                const checkInDate = new Date(checkIn.value);
                const checkOutDate = new Date(checkOut.value);
                
                const checkInStr = `${checkInDate.getMonth() + 1}月${checkInDate.getDate()}日`;
                const checkOutStr = `${checkOutDate.getMonth() + 1}月${checkOutDate.getDate()}日`;
                
                dateDisplay.textContent = `${checkInStr} - ${checkOutStr}`;
            } else if (checkIn.value) {
                const checkInDate = new Date(checkIn.value);
                const checkInStr = `${checkInDate.getMonth() + 1}月${checkInDate.getDate()}日`;
                dateDisplay.textContent = `${checkInStr} - 选择离店日期`;
            } else if (checkOut.value) {
                const checkOutDate = new Date(checkOut.value);
                const checkOutStr = `${checkOutDate.getMonth() + 1}月${checkOutDate.getDate()}日`;
                dateDisplay.textContent = `选择入住日期 - ${checkOutStr}`;
            } else {
                dateDisplay.textContent = '选择日期';
            }
            dateModal.hide();
        });
    },
    
    // 获取选择的日期
    getSelectedDates() {
        const checkIn = document.getElementById('check-in');
        const checkOut = document.getElementById('check-out');
        
        if (!checkIn || !checkOut) return { checkIn: '', checkOut: '' };
        
        return {
            checkIn: checkIn.value,
            checkOut: checkOut.value
        };
    }
};

export default datepickerModule;