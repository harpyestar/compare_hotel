/**
 * 日期选择功能
 */
const datepickerModule = {
    flatpickrInstance: null,

    init() {
        this.setupDatePicker();
    },

    setupDatePicker() {
        const dateBtn = document.getElementById('dateBtn');
        const dateDisplay = document.getElementById('dateDisplay');

        if (!dateBtn || !dateDisplay) {
            console.log('dateBtn or dateDisplay not found');
            return;
        }

        dateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openDatePicker();
        });
    },

    openDatePicker() {
        if (typeof flatpickr === 'undefined') {
            console.error('flatpickr not loaded!');
            alert('日期选择器加载失败，请刷新页面');
            return;
        }

        const dateDisplay = document.getElementById('dateDisplay');
        const dateBtn = document.getElementById('dateBtn');

        if (this.flatpickrInstance) {
            this.flatpickrInstance.open();
            return;
        }

        const rect = dateBtn.getBoundingClientRect();
        const container = document.createElement('div');
        container.id = 'datePickerContainer';
        container.style.position = 'fixed';
        container.style.top = `${rect.bottom + 10}px`;
        container.style.left = `${rect.left}px`;
        container.style.zIndex = '10001';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #e5e5e5';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        container.style.padding = '16px';
        container.style.minWidth = '400px';
        document.body.appendChild(container);

        const calendarContainer = document.createElement('div');
        calendarContainer.id = 'calendarContainer';
        container.appendChild(calendarContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '16px';
        buttonContainer.style.paddingTop = '16px';
        buttonContainer.style.borderTop = '1px solid #e5e5e5';

        const quickButtons = [
            { text: '今晚', days: 0 },
            { text: '明晚', days: 1 },
            { text: '本周末', days: this.getDaysUntilWeekend() },
            { text: '下周末', days: this.getDaysUntilWeekend() + 7 }
        ];

        quickButtons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.padding = '6px 12px';
            button.style.border = '1px solid #e5e5e5';
            button.style.borderRadius = '4px';
            button.style.backgroundColor = 'white';
            button.style.color = '#333';
            button.style.fontSize = '14px';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.2s';
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#f5f5f5';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = 'white';
            });
            button.addEventListener('click', () => {
                this.selectQuickDate(btn.days);
            });
            buttonContainer.appendChild(button);
        });

        container.appendChild(buttonContainer);

        const selectedDates = this.getSelectedDates();
        const options = {
            mode: 'range',
            dateFormat: 'Y-m-d',
            defaultDate: selectedDates.checkIn && selectedDates.checkOut ? [selectedDates.checkIn, selectedDates.checkOut] : null,
            showMonths: 2,
            inline: true,
            monthSelectorType: 'static',
            weekdayLabels: ['日', '一', '二', '三', '四', '五', '六'],
            todayClass: 'today-highlight',
            onClose: (selectedDates, dateStr, instance) => {
                if (selectedDates.length === 2) {
                    const checkInDate = selectedDates[0];
                    const checkOutDate = selectedDates[1];
                    const checkInStr = `${checkInDate.getMonth() + 1}月${checkInDate.getDate()}日`;
                    const checkOutStr = `${checkOutDate.getMonth() + 1}月${checkOutDate.getDate()}日`;
                    dateDisplay.textContent = `${checkInStr} - ${checkOutStr}`;
                }
                setTimeout(() => {
                    if (container.parentNode) {
                        container.parentNode.removeChild(container);
                    }
                    this.flatpickrInstance = null;
                }, 100);
            }
        };

        try {
            if (flatpickr.l10ns.zh) {
                options.locale = flatpickr.l10ns.zh;
            }
        } catch (e) {
            console.log('Using default locale');
        }

        this.flatpickrInstance = flatpickr(calendarContainer, options);
    },

    selectQuickDate(daysFromNow) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + daysFromNow);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + 1);

        this.flatpickrInstance.setDate([checkIn, checkOut], true);
        
        // 直接完成选择并关闭日历
        const dateDisplay = document.getElementById('dateDisplay');
        const checkInStr = `${checkIn.getMonth() + 1}月${checkIn.getDate()}日`;
        const checkOutStr = `${checkOut.getMonth() + 1}月${checkOut.getDate()}日`;
        dateDisplay.textContent = `${checkInStr} - ${checkOutStr}`;
        
        // 关闭日历
        const container = document.getElementById('datePickerContainer');
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        this.flatpickrInstance = null;
    },

    getDaysUntilWeekend() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 6) return 0; // 今天是周六
        if (dayOfWeek === 5) return 1; // 今天是周五
        return 6 - dayOfWeek; // 其他天
    },

    getSelectedDates() {
        const dateDisplay = document.getElementById('dateDisplay');
        if (!dateDisplay) return { checkIn: null, checkOut: null };
        const text = dateDisplay.textContent;
        if (text === '选择日期' || !text.includes(' - ')) {
            return { checkIn: null, checkOut: null };
        }
        
        // 解析日期字符串
        const parts = text.split(' - ');
        if (parts.length !== 2) return { checkIn: null, checkOut: null };
        
        const parseDate = (dateStr) => {
            const match = dateStr.match(/(\d+)月(\d+)日/);
            if (!match) return null;
            const month = parseInt(match[1]) - 1;
            const day = parseInt(match[2]);
            const date = new Date();
            date.setMonth(month);
            date.setDate(day);
            // 处理月份跨年的情况
            if (month < date.getMonth()) {
                date.setFullYear(date.getFullYear() + 1);
            }
            return date;
        };
        
        const checkIn = parseDate(parts[0]);
        const checkOut = parseDate(parts[1]);
        
        return { checkIn, checkOut };
    }
};

export default datepickerModule;
