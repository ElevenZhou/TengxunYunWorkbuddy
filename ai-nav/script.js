// AI Hub - 智能AI工具导航交互脚本

// 主题切换
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // 检查本地存储的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeToggle.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    });
});

// 分类筛选
document.addEventListener('DOMContentLoaded', function() {
    const categoryItems = document.querySelectorAll('.category-item');
    const toolCards = document.querySelectorAll('.tool-card');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            toolCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// 搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const toolCards = document.querySelectorAll('.tool-card');
    
    searchInput.addEventListener('input', function() {
        const keyword = this.value.toLowerCase().trim();
        
        toolCards.forEach(card => {
            const name = card.querySelector('.tool-name').textContent.toLowerCase();
            const desc = card.querySelector('.tool-desc').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
            
            if (name.includes(keyword) || desc.includes(keyword) || tags.some(t => t.includes(keyword))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 收藏功能
document.addEventListener('DOMContentLoaded', function() {
    const favoriteBtns = document.querySelectorAll('.action-btn.favorite');
    
    // 从本地存储加载收藏状态
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    favoriteBtns.forEach(btn => {
        const card = btn.closest('.tool-card');
        const toolName = card.querySelector('.tool-name').textContent.trim();
        
        // 初始化收藏状态
        if (favorites.includes(toolName)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                this.classList.remove('active');
                this.innerHTML = '<i class="far fa-heart"></i>';
                
                // 从收藏列表移除
                const index = favorites.indexOf(toolName);
                if (index > -1) favorites.splice(index, 1);
            } else {
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-heart"></i>';
                
                // 添加到收藏列表
                favorites.push(toolName);
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
});

// 对比功能
document.addEventListener('DOMContentLoaded', function() {
    const compareBtns = document.querySelectorAll('.action-btn.compare');
    const compareList = document.getElementById('compareList');
    const compareCount = document.querySelector('.compare-count');
    const btnCompare = document.getElementById('btnCompare');
    
    let compareItems = [];
    
    compareBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = this.closest('.tool-card');
            const toolName = card.querySelector('.tool-name').textContent.trim();
            const toolIcon = card.querySelector('.tool-icon').src;
            
            // 检查是否已添加
            const exists = compareItems.find(item => item.name === toolName);
            
            if (exists) {
                // 移除
                compareItems = compareItems.filter(item => item.name !== toolName);
                this.classList.remove('active');
                this.style.background = '';
                this.style.color = '';
            } else {
                // 添加
                if (compareItems.length >= 3) {
                    alert('最多可同时对比3个工具');
                    return;
                }
                compareItems.push({ name: toolName, icon: toolIcon });
                this.classList.add('active');
                this.style.background = 'var(--primary-color)';
                this.style.color = 'white';
            }
            
            updateCompareList();
        });
    });
    
    function updateCompareList() {
        compareCount.textContent = `(${compareItems.length}/3)`;
        
        if (compareItems.length === 0) {
            compareList.innerHTML = '<p class="empty-tip">点击工具卡片上的对比按钮，添加工具进行对比</p>';
            btnCompare.disabled = true;
        } else {
            compareList.innerHTML = compareItems.map(item => `
                <div class="compare-item">
                    <img src="${item.icon}" alt="${item.name}">
                    <span>${item.name}</span>
                    <button class="remove-btn" data-name="${item.name}"><i class="fas fa-times"></i></button>
                </div>
            `).join('');
            btnCompare.disabled = compareItems.length < 2;
            
            // 绑定移除事件
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const name = this.dataset.name;
                    compareItems = compareItems.filter(item => item.name !== name);
                    
                    // 同步更新卡片上的按钮状态
                    document.querySelectorAll('.tool-card').forEach(card => {
                        if (card.querySelector('.tool-name').textContent.trim() === name) {
                            const compareBtn = card.querySelector('.action-btn.compare');
                            compareBtn.classList.remove('active');
                            compareBtn.style.background = '';
                            compareBtn.style.color = '';
                        }
                    });
                    
                    updateCompareList();
                });
            });
        }
    }
    
    // 开始对比
    btnCompare.addEventListener('click', function() {
        if (compareItems.length >= 2) {
            alert(`正在对比: ${compareItems.map(i => i.name).join(' vs ')}\n\n对比功能演示 - 实际项目中会打开对比详情页`);
        }
    });
});

// 筛选标签
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-tabs .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加实际的筛选逻辑
            console.log('筛选:', this.textContent);
        });
    });
});

// 视图切换
document.addEventListener('DOMContentLoaded', function() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const toolsGrid = document.getElementById('toolsGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            
            if (view === 'list') {
                toolsGrid.style.gridTemplateColumns = '1fr';
            } else {
                toolsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            }
        });
    });
});

// 弹窗功能
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('toolModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.getElementById('modalBody');
    const detailBtns = document.querySelectorAll('.btn-secondary');
    
    detailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.tool-card');
            const toolName = card.querySelector('.tool-name').textContent.trim();
            const toolDesc = card.querySelector('.tool-desc').textContent;
            const toolIcon = card.querySelector('.tool-icon').src;
            const rating = card.querySelector('.rating span').textContent;
            
            modalBody.innerHTML = `
                <div class="modal-header">
                    <img src="${toolIcon}" alt="${toolName}" style="width: 64px; height: 64px; border-radius: 12px; margin-bottom: 16px;">
                    <h2>${toolName}</h2>
                    <div class="modal-rating">
                        <i class="fas fa-star" style="color: #FBBF24;"></i>
                        <span>${rating}</span>
                    </div>
                </div>
                <div class="modal-section">
                    <h3>工具简介</h3>
                    <p>${toolDesc}</p>
                </div>
                <div class="modal-section">
                    <h3>核心功能</h3>
                    <ul>
                        <li>智能文本生成与处理</li>
                        <li>多语言支持与翻译</li>
                        <li>代码编写与调试辅助</li>
                        <li>数据分析与可视化</li>
                    </ul>
                </div>
                <div class="modal-section">
                    <h3>用户评价</h3>
                    <div class="review-item">
                        <div class="review-header">
                            <strong>用户A</strong>
                            <span class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></span>
                        </div>
                        <p>非常好用的AI工具，大大提高了工作效率！</p>
                    </div>
                    <div class="review-item">
                        <div class="review-header">
                            <strong>用户B</strong>
                            <span class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></span>
                        </div>
                        <p>功能强大，但有时候响应速度稍慢。</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" style="flex: 1; padding: 14px;">访问官网</button>
                    <button class="btn-secondary" style="flex: 1; padding: 14px;">收藏工具</button>
                </div>
            `;
            
            modal.classList.add('active');
        });
    });
    
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// 加载更多
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    loadMoreBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        
        // 模拟加载延迟
        setTimeout(() => {
            this.innerHTML = '加载更多工具 <i class="fas fa-chevron-down"></i>';
            alert('已加载更多工具（演示功能）');
        }, 1000);
    });
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-header {
        text-align: center;
        margin-bottom: 24px;
    }
    
    .modal-rating {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 8px;
        font-size: 18px;
    }
    
    .modal-section {
        margin-bottom: 24px;
    }
    
    .modal-section h3 {
        font-size: 16px;
        margin-bottom: 12px;
        color: var(--text-primary);
    }
    
    .modal-section p {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .modal-section ul {
        list-style: none;
        padding: 0;
    }
    
    .modal-section ul li {
        padding: 8px 0;
        padding-left: 20px;
        position: relative;
        color: var(--text-secondary);
    }
    
    .modal-section ul li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--secondary-color);
        font-weight: bold;
    }
    
    .review-item {
        background: var(--bg-color);
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 12px;
    }
    
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .review-header .stars {
        color: #FBBF24;
        font-size: 12px;
    }
    
    .review-item p {
        font-size: 14px;
        margin: 0;
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
    }
`;
document.head.appendChild(style);

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('🤖 AI Hub 导航网站已加载完成！');
console.log('✨ 特色功能：智能推荐、工具对比、深色模式、收藏同步');
