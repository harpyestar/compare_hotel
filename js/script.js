        // 服务器URL
        const SERVER_URL = 'http://localhost:3000';

        // 搜索联想功能
        const destinationInput = document.getElementById('destination');
        const suggestionsContainer = document.getElementById('suggestions');
        
        destinationInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 0) {
                // 发送请求到后端获取联想结果
                fetch(`${SERVER_URL}/api/suggestions?query=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        // 显示联想结果
                        showSuggestions(data);
                    })
                    .catch(error => {
                        console.error('Error fetching suggestions:', error);
                        suggestionsContainer.style.display = 'none';
                    });
            } else {
                // 清空联想结果
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // 显示联想结果
        function showSuggestions(suggestions) {
            suggestionsContainer.innerHTML = '';
            if (suggestions.length > 0) {
                // 显示所有匹配的结果，让滚动条发挥作用
                suggestions.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item p-2 hover:bg-gray-100 cursor-pointer';
                    div.textContent = item;
                    div.addEventListener('click', function() {
                        destinationInput.value = item;
                        suggestionsContainer.style.display = 'none';
                    });
                    suggestionsContainer.appendChild(div);
                });
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        }
        
        // 点击页面其他地方隐藏联想结果
        document.addEventListener('click', function(event) {
            if (!destinationInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });

        // 搜索栏向导功能
        document.querySelectorAll('.guide-item').forEach(item => {
            item.addEventListener('click', function() {
                document.getElementById('destination').value = this.textContent;
            });
        });

        // 表单提交处理
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            const destination = document.getElementById('destination').value;
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            
            if (!destination || !checkIn || !checkOut) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 这里可以添加搜索逻辑
            alert(`搜索 ${destination} 从 ${checkIn} 到 ${checkOut}`);
        });

        // 比较功能
        const checkboxes = document.querySelectorAll('.form-check-input');
        const compareBtn = document.getElementById('compareBtn');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateCompareBtn);
        });
        
        function updateCompareBtn() {
            const checkedCount = document.querySelectorAll('.form-check-input:checked').length;
            compareBtn.innerHTML = `<i class="fas fa-balance-scale mr-2"></i> 比较酒店 (${checkedCount})`;
            
            if (checkedCount >= 2) {
                compareBtn.classList.remove('disabled');
            } else {
                compareBtn.classList.add('disabled');
            }
        }
        
        compareBtn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                const checkedHotels = document.querySelectorAll('.form-check-input:checked');
                const hotelNames = Array.from(checkedHotels).map(checkbox => {
                    return checkbox.closest('.hotel-card').querySelector('.hotel-name').textContent;
                });
                
                alert(`比较酒店：${hotelNames.join(', ')}`);
                // 这里可以跳转到比较结果页面
            }
        });
        
        // 向导功能
        const guideButton = document.getElementById('guideButton');
        const guideOverlay = document.getElementById('guideOverlay');
        const guideModal = document.getElementById('guideModal');
        const guideContent = document.getElementById('guideContent');
        const guideClose = document.getElementById('guideClose');
        const guideNext = document.getElementById('guideNext');
        const guideHighlight = document.getElementById('guideHighlight');
        
        let currentStep = 0;
        const guideSteps = [
            {
                title: '搜索酒店',
                content: '在搜索框中输入目的地，选择入住和离店日期，然后点击搜索按钮。',
                target: '.search-container'
            },
            {
                title: '合作平台',
                content: '我们与多家国内酒店预订平台合作，为您提供最全面的价格比较。',
                target: '.platforms'
            },
            {
                title: '热门酒店',
                content: '浏览热门搜索酒店，点击酒店卡片查看详情，或选择多个酒店进行比较。',
                target: '.hotels'
            }
        ];
        
        // 打开向导
        guideButton.addEventListener('click', function() {
            startGuide();
        });
        
        // 关闭向导
        guideClose.addEventListener('click', function() {
            closeGuide();
        });
        
        // 上一步
        const guidePrev = document.getElementById('guidePrev');
        guidePrev.addEventListener('click', function() {
            currentStep--;
            if (currentStep >= 0) {
                showGuideStep(currentStep);
            }
        });
        
        // 下一步
        guideNext.addEventListener('click', function() {
            currentStep++;
            if (currentStep < guideSteps.length) {
                showGuideStep(currentStep);
            } else {
                closeGuide();
            }
        });
        
        // 开始向导
        function startGuide() {
            currentStep = 0;
            guideOverlay.style.display = 'block';
            guideModal.style.display = 'block';
            // 立即显示高亮区域，确保不会出现空白
            guideHighlight.style.display = 'block';
            // 立即计算并显示第一步的高亮区域
            const firstTarget = document.querySelector(guideSteps[0].target);
            if (firstTarget) {
                const rect = firstTarget.getBoundingClientRect();
                guideHighlight.style.position = 'fixed';
                guideHighlight.style.left = `${rect.left - 10}px`;
                guideHighlight.style.top = `${rect.top - 10}px`;
                guideHighlight.style.width = `${rect.width + 20}px`;
                guideHighlight.style.height = `${rect.height + 20}px`;
            }
            // 滚动到目标元素
            showGuideStep(currentStep);
        }
        
        // 显示向导步骤
        function showGuideStep(step) {
            const currentGuide = guideSteps[step];
            document.querySelector('.guide-modal h3').textContent = currentGuide.title;
            guideContent.textContent = currentGuide.content;
            
            // 更新按钮状态
            if (step === 0) {
                // 第一步，隐藏上一步按钮
                guidePrev.style.display = 'none';
            } else {
                // 不是第一步，显示上一步按钮
                guidePrev.style.display = 'inline-block';
            }
            
            // 更新下一步按钮文本
            if (step === guideSteps.length - 1) {
                guideNext.textContent = '完成';
            } else {
                guideNext.textContent = '下一步';
            }
            
            // 高亮目标元素
            const targetElement = document.querySelector(currentGuide.target);
            if (targetElement) {
                // 先滚动到目标元素
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // 垂直居中
                    inline: 'center' // 水平居中
                });
                
                // 等待滚动完成后再计算位置
                setTimeout(() => {
                    const rect = targetElement.getBoundingClientRect();
                    // 确保guideHighlight使用fixed定位
                    guideHighlight.style.position = 'fixed';
                    guideHighlight.style.left = `${rect.left - 10}px`;
                    guideHighlight.style.top = `${rect.top - 10}px`;
                    guideHighlight.style.width = `${rect.width + 20}px`;
                    guideHighlight.style.height = `${rect.height + 20}px`;
                    guideHighlight.style.display = 'block';
                }, 500); // 等待500ms确保滚动完成
            } else {
                guideHighlight.style.display = 'none';
            }
        }
        
        // 关闭向导
        function closeGuide() {
            guideOverlay.style.display = 'none';
            guideModal.style.display = 'none';
            guideHighlight.style.display = 'none';
        }

        // 用户认证功能
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userInfo = document.getElementById('userInfo');
        const usernameDisplay = document.getElementById('usernameDisplay');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        const historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
        const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));

        // 登录按钮点击事件
        loginBtn.addEventListener('click', function() {
            loginModal.show();
        });

        // 注册按钮点击事件
        registerBtn.addEventListener('click', function() {
            registerModal.show();
        });

        // 保存会话ID
        function saveSessionId(sessionId) {
            localStorage.setItem('sessionId', sessionId);
        }

        // 获取会话ID
        function getSessionId() {
            return localStorage.getItem('sessionId');
        }

        // 清除会话ID
        function clearSessionId() {
            localStorage.removeItem('sessionId');
        }

        // 构建请求头
        function getHeaders() {
            const sessionId = getSessionId();
            const headers = {
                'Content-Type': 'application/json'
            };
            if (sessionId) {
                headers['Authorization'] = sessionId;
            }
            return headers;
        }

        // 登录表单提交
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            fetch(`${SERVER_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    saveSessionId(data.sessionId);
                    loginModal.hide();
                    showUserInfo(data.username);
                    alert('登录成功！');
                } else {
                    alert('登录失败：' + data.message);
                }
            })
            .catch(error => {
                console.error('登录错误:', error);
                alert('登录失败，请稍后重试');
            });
        });

        // 注册表单提交
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }

            fetch(`${SERVER_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    saveSessionId(data.sessionId);
                    registerModal.hide();
                    showUserInfo(data.username);
                    alert('注册成功！');
                } else {
                    alert('注册失败：' + data.message);
                }
            })
            .catch(error => {
                console.error('注册错误:', error);
                alert('注册失败，请稍后重试');
            });
        });

        // 显示用户信息
        function showUserInfo(username) {
            if (usernameDisplay) {
                usernameDisplay.textContent = username;
            }
            if (userInfo) {
                userInfo.style.display = 'block';
            }
            const userAuth = document.querySelector('.user-auth');
            if (userAuth) {
                userAuth.style.display = 'none';
            }
        }

        // 退出登录
        document.getElementById('logoutBtn').addEventListener('click', function() {
            fetch(`${SERVER_URL}/api/logout`, {
                method: 'POST',
                headers: getHeaders()
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    clearSessionId();
                    if (userInfo) {
                        userInfo.style.display = 'none';
                    }
                    const userAuth = document.querySelector('.user-auth');
                    if (userAuth) {
                        userAuth.style.display = 'block';
                    }
                    alert('已退出登录');
                } else {
                    alert('退出登录失败：' + (data.message || '未知错误'));
                }
            })
            .catch(error => {
                console.error('退出登录错误:', error);
                alert('退出登录失败，请稍后重试');
            });
        });

        // 查看搜索历史
        document.getElementById('historyBtn').addEventListener('click', function() {
            fetch(`${SERVER_URL}/api/history`, {
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                const historyList = document.getElementById('historyList');
                historyList.innerHTML = '';
                
                if (data.history && data.history.length > 0) {
                    data.history.forEach(item => {
                        const listItem = document.createElement('a');
                        listItem.href = '#';
                        listItem.className = 'list-group-item list-group-item-action';
                        listItem.textContent = `${item.destination} (${item.checkIn} 至 ${item.checkOut})`;
                        listItem.addEventListener('click', function(e) {
                            e.preventDefault();
                            document.getElementById('destination').value = item.destination;
                            document.getElementById('check-in').value = item.checkIn;
                            document.getElementById('check-out').value = item.checkOut;
                            historyModal.hide();
                        });
                        historyList.appendChild(listItem);
                    });
                } else {
                    const emptyItem = document.createElement('div');
                    emptyItem.className = 'text-center text-muted py-3';
                    emptyItem.textContent = '暂无搜索历史';
                    historyList.appendChild(emptyItem);
                }
                historyModal.show();
            });
        });

        // 查看收藏酒店
        document.getElementById('favoritesBtn').addEventListener('click', function() {
            fetch(`${SERVER_URL}/api/favorites`, {
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                const favoritesList = document.getElementById('favoritesList');
                favoritesList.innerHTML = '';
                
                if (data.favorites && data.favorites.length > 0) {
                    data.favorites.forEach(hotel => {
                        const hotelCard = document.createElement('div');
                        hotelCard.className = 'col-md-4 mb-4';
                        hotelCard.innerHTML = `
                            <div class="hotel-card">
                                <div class="hotel-image">
                                    <img src="${hotel.image}" alt="${hotel.name}">
                                </div>
                                <div class="hotel-info">
                                    <h3 class="hotel-name">${hotel.name}</h3>
                                    <p class="hotel-address">${hotel.address}</p>
                                    <div class="hotel-price">¥${hotel.price.toLocaleString()} <span>起/晚</span></div>
                                    <button class="btn btn-sm btn-outline-danger remove-favorite" data-hotel-id="${hotel.id}">
                                        <i class="fas fa-heart"></i> 取消收藏
                                    </button>
                                </div>
                            </div>
                        `;
                        favoritesList.appendChild(hotelCard);
                    });
                    
                    // 添加取消收藏事件
                    document.querySelectorAll('.remove-favorite').forEach(button => {
                        button.addEventListener('click', function() {
                            const hotelId = this.getAttribute('data-hotel-id');
                            removeFavorite(hotelId);
                        });
                    });
                } else {
                    const emptyItem = document.createElement('div');
                    emptyItem.className = 'col-12 text-center text-muted py-5';
                    emptyItem.textContent = '暂无收藏酒店';
                    favoritesList.appendChild(emptyItem);
                }
                favoritesModal.show();
            });
        });

        // 收藏酒店
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', function() {
                const hotelId = this.getAttribute('data-hotel-id');
                const hotelName = this.getAttribute('data-hotel-name');
                const hotelAddress = this.getAttribute('data-hotel-address');
                const hotelPrice = this.getAttribute('data-hotel-price');
                const hotelImage = this.getAttribute('data-hotel-image');

                fetch(`${SERVER_URL}/api/favorites`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ id: hotelId, name: hotelName, address: hotelAddress, price: parseInt(hotelPrice), image: hotelImage })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.innerHTML = '<i class="fas fa-heart"></i>';
                        alert('酒店已收藏');
                    } else {
                        alert('收藏失败：' + data.message);
                    }
                })
                .catch(error => {
                    console.error('收藏错误:', error);
                    alert('收藏失败，请先登录');
                });
            });
        });

        // 取消收藏
        function removeFavorite(hotelId) {
            fetch(`${SERVER_URL}/api/favorites/${hotelId}`, {
                method: 'DELETE',
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('已取消收藏');
                    // 刷新收藏列表
                    document.getElementById('favoritesBtn').click();
                } else {
                    alert('取消收藏失败：' + data.message);
                }
            });
        }

        // 保存搜索历史
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            const destination = document.getElementById('destination').value;
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            
            if (!destination || !checkIn || !checkOut) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 保存搜索历史
            fetch(`${SERVER_URL}/api/history`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ destination, checkIn, checkOut })
            })
            .then(response => response.json())
            .then(data => {
                // 这里可以添加搜索逻辑
                alert(`搜索 ${destination} 从 ${checkIn} 到 ${checkOut}`);
            })
            .catch(error => {
                console.error('保存搜索历史错误:', error);
                // 即使保存失败，也继续搜索
                alert(`搜索 ${destination} 从 ${checkIn} 到 ${checkOut}`);
            });
        });

        // 检查用户登录状态
        function checkLoginStatus() {
            fetch(`${SERVER_URL}/api/check-login`, {
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    showUserInfo(data.username);
                }
            });
        }

        // 日期选择功能
        const dateBtn = document.getElementById('dateBtn');
        const dateModal = new bootstrap.Modal(document.getElementById('dateModal'));
        const dateDisplay = document.getElementById('dateDisplay');
        const checkIn = document.getElementById('check-in');
        const checkOut = document.getElementById('check-out');
        const resetDate = document.getElementById('resetDate');
        const applyDate = document.getElementById('applyDate');

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

        // 人数与客房数功能
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

        // 页面加载时检查登录状态
        checkLoginStatus();