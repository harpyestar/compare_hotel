/**
 * 日期选择功能
 */
// 使用默认值作为后备，确保即使i18next未初始化也能正常显示
const getTranslation = (key, defaultValue) => {
    if (typeof window.t === 'function') {
        const translated = window.t(key);
        return translated !== key ? translated : defaultValue;
    }
    return defaultValue;
};

const datepickerModule = {
    flatpickrInstance: null,
    handleOutsideClick: null,

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

        // 检查是否已经存在日历容器
        const existingContainer = document.getElementById('datePickerContainer');
        if (existingContainer) {
            // 如果已经存在，直接返回
            return;
        }

        const rect = dateBtn.getBoundingClientRect();
        const container = document.createElement('div');
        container.id = 'datePickerContainer';
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
        container.style.minWidth = '400px';
        
        // 确保日期选择器容器相对于dateBtn定位
        dateBtn.style.position = 'relative';
        dateBtn.appendChild(container);

        const calendarContainer = document.createElement('div');
        calendarContainer.id = 'calendarContainer';
        // 移除固定高度，让内容自适应
        calendarContainer.style.width = '100%';
        calendarContainer.style.backgroundColor = '#f9f9f9';
        calendarContainer.style.border = '1px solid #e5e5e5';
        calendarContainer.style.borderRadius = '4px';
        calendarContainer.style.padding = '10px';
        console.log('Created calendar container:', calendarContainer);
        container.appendChild(calendarContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '16px';
        buttonContainer.style.paddingTop = '16px';
        buttonContainer.style.borderTop = '1px solid #e5e5e5';

        const quickButtons = [
            { text: getTranslation('datepicker.quickButtons.tonight', '今晚'), days: 0 },
            { text: getTranslation('datepicker.quickButtons.tomorrow', '明晚'), days: 1 },
            { text: getTranslation('datepicker.quickButtons.thisWeekend', '本周末'), days: this.getDaysUntilWeekend() },
            { text: getTranslation('datepicker.quickButtons.nextWeekend', '下周末'), days: this.getDaysUntilWeekend() + 7 }
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
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                this.selectQuickDate(btn.days);
            });
            buttonContainer.appendChild(button);
        });

        container.appendChild(buttonContainer);

        // 添加点击外侧关闭的功能
        this.handleOutsideClick = (e) => {
            // 确保事件监听器只在容器存在时执行
            const currentContainer = document.getElementById('datePickerContainer');
            if (!currentContainer) {
                document.removeEventListener('click', this.handleOutsideClick);
                return;
            }
            
            if (!currentContainer.contains(e.target) && e.target !== dateBtn) {
                if (currentContainer.parentNode) {
                    currentContainer.parentNode.removeChild(currentContainer);
                }
                this.flatpickrInstance = null;
                document.removeEventListener('click', this.handleOutsideClick);
                this.handleOutsideClick = null;
            }
        };
        
        // 立即添加事件监听器，使用捕获模式确保事件被正确捕获
        document.addEventListener('click', this.handleOutsideClick, true);

        const selectedDates = this.getSelectedDates();
        const currentLang = typeof i18next !== 'undefined' ? i18next.language : 'zh-CN';
        const isEnglish = currentLang === 'en-US';

        // 确保flatpickr存在
        if (typeof flatpickr === 'function') {
            try {
                // 确保calendarContainer存在
                if (calendarContainer) {
                    // 根据当前语言设置locale
                    const locale = isEnglish ? 'en' : 'zh';
                    
                    const simpleOptions = {
                        mode: 'range',
                        dateFormat: 'Y-m-d',
                        defaultDate: selectedDates.checkIn && selectedDates.checkOut ? [selectedDates.checkIn, selectedDates.checkOut] : null,
                        showMonths: 2,
                        inline: true,
                        monthSelectorType: 'static',
                        todayClass: 'today-highlight',
                        locale: locale,
                        onClose: (selectedDates, dateStr, instance) => {
                            if (selectedDates.length === 2) {
                                const checkInDate = selectedDates[0];
                                const checkOutDate = selectedDates[1];
                                const dateFormat = getTranslation('datepicker.dateFormat', 'M月d日');
                                const checkInStr = `${checkInDate.getMonth() + 1}${dateFormat.includes('月') ? '月' : '/'}${checkInDate.getDate()}${dateFormat.includes('日') ? '日' : ''}`;
                                const checkOutStr = `${checkOutDate.getMonth() + 1}${dateFormat.includes('月') ? '月' : '/'}${checkOutDate.getDate()}${dateFormat.includes('日') ? '日' : ''}`;
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
                    
                    console.log('Initializing flatpickr with locale:', locale);
                    this.flatpickrInstance = flatpickr(calendarContainer, simpleOptions);
                    console.log('flatpickr initialized successfully');
                    // 移除固定高度，让内容自适应
                } else {
                    console.error('calendarContainer is not defined');
                }
            } catch (error) {
                console.error('Error initializing flatpickr:', error);
                // 添加错误提示
                const errorDiv = document.createElement('div');
                errorDiv.textContent = '日历加载失败，请刷新页面';
                errorDiv.style.color = 'red';
                errorDiv.style.padding = '10px';
                container.appendChild(errorDiv);
            }
        } else {
            console.error('flatpickr is not loaded');
            // 添加错误提示
            const errorDiv = document.createElement('div');
            errorDiv.textContent = '日历组件未加载，请刷新页面';
            errorDiv.style.color = 'red';
            errorDiv.style.padding = '10px';
            container.appendChild(errorDiv);
        }
    },

    selectQuickDate(daysFromNow) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + daysFromNow);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + 1);

        if (this.flatpickrInstance) {
            this.flatpickrInstance.setDate([checkIn, checkOut], true);
        }

        const dateDisplay = document.getElementById('dateDisplay');
        const dateFormat = getTranslation('datepicker.dateFormat', 'M月d日');
        const checkInStr = `${checkIn.getMonth() + 1}${dateFormat.includes('月') ? '月' : '/'}${checkIn.getDate()}${dateFormat.includes('日') ? '日' : ''}`;
        const checkOutStr = `${checkOut.getMonth() + 1}${dateFormat.includes('月') ? '月' : '/'}${checkOut.getDate()}${dateFormat.includes('日') ? '日' : ''}`;
        dateDisplay.textContent = `${checkInStr} - ${checkOutStr}`;

        // 立即关闭日历控件
        const container = document.getElementById('datePickerContainer');
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        
        // 清理实例和事件监听器
        this.flatpickrInstance = null;
        if (this.handleOutsideClick) {
            document.removeEventListener('click', this.handleOutsideClick);
            this.handleOutsideClick = null;
        }
    },

    getDaysUntilWeekend() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 6) return 0;
        if (dayOfWeek === 5) return 1;
        return 6 - dayOfWeek;
    },

    getSelectedDates() {
        const dateDisplay = document.getElementById('dateDisplay');
        if (!dateDisplay) return { checkIn: null, checkOut: null };
        const text = dateDisplay.textContent;
        if (text === getTranslation('header.selectDate', '选择日期') || !text.includes(' - ')) {
            return { checkIn: null, checkOut: null };
        }

        const parts = text.split(' - ');
        if (parts.length !== 2) return { checkIn: null, checkOut: null };

        const parseDate = (dateStr) => {
            let match;
            if (dateStr.includes('月') && dateStr.includes('日')) {
                // 中文格式: 5月1日
                match = dateStr.match(/(\d+)月(\d+)日/);
                if (!match) return null;
                const month = parseInt(match[1]) - 1;
                const day = parseInt(match[2]);
                const date = new Date();
                date.setMonth(month);
                date.setDate(day);
                if (month < date.getMonth()) {
                    date.setFullYear(date.getFullYear() + 1);
                }
                return date;
            } else if (dateStr.includes('/')) {
                // 英文格式: 5/1
                match = dateStr.match(/(\d+)\/(\d+)/);
                if (!match) return null;
                const month = parseInt(match[1]) - 1;
                const day = parseInt(match[2]);
                const date = new Date();
                date.setMonth(month);
                date.setDate(day);
                if (month < date.getMonth()) {
                    date.setFullYear(date.getFullYear() + 1);
                }
                return date;
            }
            return null;
        };

        const checkIn = parseDate(parts[0]);
        const checkOut = parseDate(parts[1]);

        return { checkIn, checkOut };
    },

    // 清理日历实例
    cleanup() {
        if (this.flatpickrInstance) {
            this.flatpickrInstance.destroy();
            this.flatpickrInstance = null;
        }
        if (this.handleOutsideClick) {
            document.removeEventListener('click', this.handleOutsideClick);
            this.handleOutsideClick = null;
        }
        // 移除日历容器
        const container = document.getElementById('datePickerContainer');
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }
};

export default datepickerModule;