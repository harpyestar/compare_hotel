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
        const container = document.getElementById('datePickerContainer') || document.createElement('div');
        if (!container.id) {
            container.id = 'datePickerContainer';
            container.style.position = 'fixed';
            container.style.top = `${rect.bottom + 10}px`;
            container.style.left = `${rect.left}px`;
            container.style.zIndex = '10001';
            document.body.appendChild(container);
        }

        const options = {
            mode: 'range',
            dateFormat: 'Y-m-d',
            defaultDate: null,
            showMonths: 2,
            theme: 'airbnb',
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

        this.flatpickrInstance = flatpickr(container, options);
        this.flatpickrInstance.open();
    },

    getSelectedDates() {
        const dateDisplay = document.getElementById('dateDisplay');
        if (!dateDisplay) return { checkIn: '', checkOut: '' };
        const text = dateDisplay.textContent;
        if (text === '选择日期' || !text.includes(' - ')) {
            return { checkIn: '', checkOut: '' };
        }
        return { checkIn: '', checkOut: '' };
    }
};

export default datepickerModule;
