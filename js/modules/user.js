/**
 * 用户认证功能
 */
import { utils } from './core.js';

// 用户认证功能
const userModule = {
    // 初始化用户认证功能
    init() {
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupLogout();
        this.setupLoginRegisterButtons();
        this.checkLoginStatus();
    },
    
    // 设置登录注册按钮
    setupLoginRegisterButtons() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const historyBtn = document.getElementById('historyBtn');
        const favoritesBtn = document.getElementById('favoritesBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            });
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
                registerModal.show();
            });
        }
        
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                const historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
                historyModal.show();
            });
        }
        
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));
                favoritesModal.show();
            });
        }
    },
    
    // 设置登录表单
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            const response = await utils.fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            console.log('Login response:', response);
            
            if (response.success) {
                this.showUserInfo(username);
                if (response.sessionId) {
                    localStorage.setItem('sessionId', response.sessionId);
                    console.log('SessionId saved:', response.sessionId);
                }
                utils.showToast('登录成功！');
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                if (loginModal) loginModal.hide();
            } else {
                utils.showToast('登录失败：' + response.error, 'error');
            }
        });
    },
    
    // 设置注册表单
    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (!registerForm) return;
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            
            const response = await utils.fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            if (response.success) {
                this.showUserInfo(username);
                localStorage.setItem('sessionId', response.sessionId);
                utils.showToast('注册成功！');
                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                if (registerModal) registerModal.hide();
            } else {
                utils.showToast('注册失败：' + response.error, 'error');
            }
        });
    },
    
    // 设置退出登录
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (!logoutBtn) return;
        
        logoutBtn.addEventListener('click', async () => {
            const response = await utils.fetch('/api/logout', {
                method: 'POST'
            });
            
            if (response.success) {
                this.showLoginRegisterButtons();
                localStorage.removeItem('sessionId');
                utils.showToast('退出登录成功！');
            } else {
                utils.showToast('退出登录失败：' + response.error, 'error');
            }
        });
    },
    
    // 检查登录状态
    async checkLoginStatus() {
        const currentSessionId = localStorage.getItem('sessionId');
        console.log('Current sessionId from localStorage:', currentSessionId);
        
        const response = await utils.fetch('/api/check-login', {
            headers: {
                'Authorization': currentSessionId
            }
        });
        
        console.log('Check login response:', response);
        
        if (response.loggedIn) {
            // 如果登录成功，确保sessionId被保存
            if (response.sessionId) {
                localStorage.setItem('sessionId', response.sessionId);
                console.log('SessionId saved from response:', response.sessionId);
            } else if (currentSessionId) {
                // 如果服务器没有返回sessionId但localStorage中有，保持不变
                console.log('Using existing sessionId from localStorage');
            }
            this.showUserInfo(response.username);
        } else {
            // 未登录，清除localStorage中的sessionId
            localStorage.removeItem('sessionId');
            console.log('Not logged in, sessionId removed from localStorage');
            this.showLoginRegisterButtons();
        }
    },
    
    // 显示用户信息
    showUserInfo(username) {
        const userInfo = document.getElementById('userInfo');
        const loginRegister = document.getElementById('loginRegister');
        const usernameDisplay = document.getElementById('usernameDisplay');
        const languageSelector = document.getElementById('languageSelector');
        
        if (userInfo && loginRegister && usernameDisplay && languageSelector) {
            usernameDisplay.textContent = username;
            userInfo.style.display = 'block';
            loginRegister.style.display = 'none';
            languageSelector.style.display = 'none';
        }
    },
    
    // 显示登录注册按钮
    showLoginRegisterButtons() {
        const userInfo = document.getElementById('userInfo');
        const loginRegister = document.getElementById('loginRegister');
        const languageSelector = document.getElementById('languageSelector');
        
        if (userInfo && loginRegister && languageSelector) {
            userInfo.style.display = 'none';
            loginRegister.style.display = 'flex';
            languageSelector.style.display = 'block';
        }
    }
};

export default userModule;