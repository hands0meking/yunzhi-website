/**
 * 云智科技企业官网 - 交互脚本
 * 功能：导航、表单提交、页面切换、响应式处理
 */

(function() {
    'use strict';

    // ========================================
    // DOM 元素
    // ========================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');

    // ========================================
    // 导航功能
    // ========================================

    // 移动端菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 导航链接点击处理
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // 如果是锚点链接
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.slice(1);
                
                // 关闭移动端菜单
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // 切换页面
                switchPage(targetId);
                
                // 更新导航状态
                updateNavState(targetId);
                
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 页面切换函数
    function switchPage(pageId) {
        // 隐藏所有页面
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示目标页面
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // 更新浏览器历史
        history.pushState({ page: pageId }, '', `#${pageId}`);
    }

    // 更新导航状态
    function updateNavState(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    // 浏览器前进/后退处理
    window.addEventListener('popstate', (e) => {
        const pageId = location.hash.slice(1) || 'home';
        switchPage(pageId);
        updateNavState(pageId);
    });

    // ========================================
    // 滚动效果
    // ========================================

    // 导航栏滚动效果
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // 添加/移除滚动样式
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ========================================
    // 表单处理
    // ========================================

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // 验证表单
            if (!validateForm(data)) {
                return;
            }
            
            // 显示加载状态
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            
            // 模拟提交延迟
            await simulateSubmit();
            
            // 显示成功弹窗
            showModal();
            
            // 重置表单
            contactForm.reset();
            
            // 恢复按钮状态
            submitBtn.disabled = false;
            btnText.style.display = '';
            btnLoading.style.display = 'none';
            
            // 打印提交的数据（实际项目中发送到服务器）
            console.log('表单提交数据:', data);
        });
    }

    // 表单验证
    function validateForm(data) {
        const errors = [];
        
        // 验证姓名
        if (!data.name || data.name.trim().length < 2) {
            errors.push('请输入有效的姓名');
        }
        
        // 验证电话
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!data.phone || !phoneRegex.test(data.phone.trim())) {
            errors.push('请输入有效的手机号码');
        }
        
        // 验证公司
        if (!data.company || data.company.trim().length < 2) {
            errors.push('请输入有效的公司名称');
        }
        
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }
        
        return true;
    }

    // 模拟提交
    function simulateSubmit() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    // ========================================
    // 弹窗功能
    // ========================================

    function showModal() {
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    window.closeModal = function() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // 点击弹窗外部关闭
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // ========================================
    // 产品详情展示
    // ========================================

    window.showProductDetail = function(productId) {
        const productNames = {
            'cloud': '智能云平台',
            'data': '数据分析引擎',
            'security': '安全管理系统',
            'office': '智能办公套件'
        };
        
        alert(`即将展示 ${productNames[productId] || '产品'} 的详细信息\n\n在实际项目中，这里会跳转到产品详情页或展开更多信息。`);
    };

    // ========================================
    // 输入框增强
    // ========================================

    // 电话号码格式化
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // 只允许数字
            e.target.value = e.target.value.replace(/\D/g, '');
            
            // 限制长度
            if (e.target.value.length > 11) {
                e.target.value = e.target.value.slice(0, 11);
            }
        });
    }

    // ========================================
    // 动画效果
    // ========================================

    // 滚动显示动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 观察所有卡片元素
    document.querySelectorAll('.feature-card, .product-preview-card, .product-detail-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 添加可见类样式
    const style = document.createElement('style');
    style.textContent = `
        .feature-card.visible,
        .product-preview-card.visible,
        .product-detail-card.visible,
        .info-card.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // 初始化
    // ========================================

    function init() {
        // 检查URL hash，设置初始页面
        const initialPage = location.hash.slice(1) || 'home';
        switchPage(initialPage);
        updateNavState(initialPage);
        
        console.log('云智科技官网已加载完成');
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
