/**
 * 创意灯泡向导功能
 */

// 向导功能
const guideModule = {
    boundUpdateHighlight: null,

    // 初始化向导功能
    init() {
        this.setupGuideButton();
        this.setupGuideSteps();
    },
    
    // 设置向导按钮
    setupGuideButton() {
        const guideButton = document.getElementById('guideButton');
        const guideOverlay = document.getElementById('guideOverlay');
        const guideModal = document.getElementById('guideModal');
        const guideClose = document.getElementById('guideClose');
        
        if (!guideButton || !guideOverlay || !guideModal || !guideClose) return;
        
        // 打开向导
        guideButton.addEventListener('click', () => {
            this.startGuide();
        });
        
        // 关闭向导
        guideClose.addEventListener('click', () => {
            this.closeGuide();
        });
        
        // 点击遮罩层关闭向导
        guideOverlay.addEventListener('click', () => {
            this.closeGuide();
        });
    },
    
    // 设置向导步骤
    setupGuideSteps() {
        const guidePrev = document.getElementById('guidePrev');
        const guideNext = document.getElementById('guideNext');
        
        if (!guidePrev || !guideNext) return;
        
        // 上一步
        guidePrev.addEventListener('click', () => {
            this.prevStep();
        });
        
        // 下一步
        guideNext.addEventListener('click', () => {
            this.nextStep();
        });
    },
    
    // 向导步骤
    steps: [
        {
            element: '#destination',
            content: '在这里输入您想要前往的城市或酒店名称，我们会为您提供相关的搜索建议。'
        },
        {
            element: '#dateBtn',
            content: '点击这里选择您的入住和离店日期，我们会根据日期为您推荐合适的酒店。'
        },
        {
            element: '#guestsBtn',
            content: '点击这里设置入住人数和客房数量，包括成人、儿童和宠物选项。'
        },
        {
            element: '.search-guide',
            content: '您可以点击这里的热门目的地快速开始搜索，或者直接输入您想去的地方。'
        },
        {
            element: '.hotel-card',
            content: '浏览酒店列表，查看酒店的价格、评分和详细信息，选择您喜欢的酒店。'
        },
        {
            element: '.compare-btn',
            content: '选择多个酒店后，点击这里可以比较它们的价格和设施，帮助您做出最佳选择。'
        },
        {
            element: '#loginRegister',
            content: '登录或注册账号，保存您的搜索历史和收藏的酒店，获得个性化的推荐。'
        }
    ],
    
    // 当前步骤
    currentStep: 0,

    // 当前元素选择器
    currentElementSelector: null,

    // 开始向导
    startGuide() {
        const guideOverlay = document.getElementById('guideOverlay');
        const guideModal = document.getElementById('guideModal');

        if (!guideOverlay || !guideModal) return;

        guideOverlay.style.display = 'block';
        guideModal.style.display = 'block';
        this.showStep(0);
    },

    // 关闭向导
    closeGuide() {
        const guideOverlay = document.getElementById('guideOverlay');
        const guideModal = document.getElementById('guideModal');
        const guideHighlight = document.getElementById('guideHighlight');

        if (guideOverlay) guideOverlay.style.display = 'none';
        if (guideModal) guideModal.style.display = 'none';
        if (guideHighlight) guideHighlight.style.display = 'none';

        // 移除滚动监听
        if (this.boundUpdateHighlight) {
            window.removeEventListener('scroll', this.boundUpdateHighlight);
            this.boundUpdateHighlight = null;
        }

        this.currentStep = 0;
        this.currentElementSelector = null;
    },

    // 显示当前步骤
    showStep(stepIndex) {
        const guideContent = document.getElementById('guideContent');
        const guidePrev = document.getElementById('guidePrev');
        const guideNext = document.getElementById('guideNext');
        const guideHighlight = document.getElementById('guideHighlight');

        if (!guideContent || !guidePrev || !guideNext || !guideHighlight) return;

        const step = this.steps[stepIndex];
        const element = document.querySelector(step.element);

        if (!element) return;

        // 保存当前选择器
        this.currentElementSelector = step.element;

        // 更新内容
        guideContent.textContent = step.content;

        // 更新按钮状态
        guidePrev.disabled = stepIndex === 0;
        guideNext.textContent = stepIndex === this.steps.length - 1 ? '完成' : '下一步';

        // 高亮元素 - 每次都更新位置
        this.updateHighlightPosition(element);

        // 移除之前的滚动监听
        if (this.boundUpdateHighlight) {
            window.removeEventListener('scroll', this.boundUpdateHighlight);
        }
        // 添加滚动监听，跟随目标元素
        this.boundUpdateHighlight = this.updateHighlight.bind(this);
        window.addEventListener('scroll', this.boundUpdateHighlight);

        // 更新当前步骤
        this.currentStep = stepIndex;
    },

    // 更新高亮位置
    updateHighlightPosition(element) {
        const guideHighlight = document.getElementById('guideHighlight');
        if (!guideHighlight || !element) return;

        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        guideHighlight.style.display = 'block';
        guideHighlight.style.top = `${rect.top}px`;
        guideHighlight.style.left = `${rect.left}px`;
        guideHighlight.style.width = `${rect.width}px`;
        guideHighlight.style.height = `${rect.height}px`;

        // 如果元素不在可视区域内，自动滚动到中间
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    },

    // 跟随滚动更新高亮 - 使用保存的选择器重新查找元素
    updateHighlight() {
        if (!this.currentElementSelector) return;
        const element = document.querySelector(this.currentElementSelector);
        if (element) {
            this.updateHighlightPosition(element);
        }
    },
    
    // 上一步
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    },
    
    // 下一步
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.closeGuide();
        }
    }
};

export default guideModule;