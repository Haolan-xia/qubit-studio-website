// 导航栏交互
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    // 移动端菜单切换
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // 点击菜单项时关闭移动端菜单
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 60; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 数字动画
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                animateNumber(target, 0, numericValue, isPercentage ? '%' : '');
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));

    function animateNumber(element, start, end, suffix) {
        const duration = 2000;
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }

    // 表单处理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // 简单的表单验证
            if (!name || !email || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 模拟发送表单
            showNotification('正在发送消息...', 'info');
            
            setTimeout(() => {
                showNotification('消息发送成功！我们会尽快回复您。', 'success');
                this.reset();
            }, 2000);
        });
    }

    // 邮箱验证
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 通知系统
    function showNotification(message, type = 'info') {
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : '#007aff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 关闭按钮
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // 自动关闭
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // 滚动动画
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .contact-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // 初始化元素样式
    document.querySelectorAll('.service-card, .portfolio-item, .contact-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // 监听滚动事件
    window.addEventListener('scroll', animateOnScroll);
    
    // 初始触发一次
    animateOnScroll();

    // 鼠标跟随效果
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const x = (clientX / innerWidth - 0.5) * 20;
            const y = (clientY / innerHeight - 0.5) * 20;
            
            const elements = document.querySelectorAll('.element');
            elements.forEach((element, index) => {
                const speed = (index + 1) * 0.5;
                element.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
        }
    });

    // 性能优化：节流滚动事件
    let ticking = false;
    function updateOnScroll() {
        animateOnScroll();
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    // ====== 语言切换功能 ======
    const translations = {
        zh: {
            'site-title': '量子工作室',
            'nav-home': '首页',
            'nav-about': '关于',
            'nav-services': '服务',
            'nav-portfolio': '作品',
            'nav-contact': '联系',
            'hero-title': 'AI赋能。<br>一人公司。',
            'hero-subtitle': '用AI工具武装自己，让一个人也能创造商业奇迹',
            'learn-ai-tools': '了解AI工具',
            'start-ai-business': '开始你的AI创业',
            'about-title': '关于量子工作室',
            'about-desc': 'AI时代，一人公司也能创造无限可能',
            'about-subtitle': 'AI赋能，让创业更简单',
            'about-p1': '量子工作室专注于帮助个人创业者利用AI工具创建和运营一人公司。我们相信，在AI的加持下，一个人可以完成传统公司需要多人协作的工作，实现真正的"一人公司"梦想。',
            'about-p2': '从创意构思到产品开发，从品牌设计到营销推广，从客户服务到财务管理，AI工具正在重塑创业的每一个环节。我们致力于帮助创业者掌握这些AI工具，让创业变得更加高效和成功。',
            'about-tools': 'AI工具推荐',
            'about-cases': '成功案例',
            'about-efficiency': '效率提升',
            'services-title': 'AI赋能的一人公司',
            'services-desc': '从创意到成功，AI助你打造完美的一人公司',
            'service-creative-title': 'AI创意与规划',
            'service-creative-desc': '利用AI进行市场调研、商业模式设计、产品定位分析。从创意构思到商业计划书，AI助你快速验证想法并制定清晰的创业路径。',
            'service-design-title': 'AI设计与品牌',
            'service-design-desc': 'AI驱动的品牌设计、Logo制作、视觉识别系统。从公司名称到完整品牌形象，AI工具让你拥有专业级的视觉设计。',
            'service-dev-title': 'AI技术开发',
            'service-dev-desc': 'AI辅助的网站开发、应用构建、自动化系统。从代码生成到测试部署，AI让技术开发变得简单高效。',
            'service-marketing-title': 'AI营销与运营',
            'service-marketing-desc': 'AI驱动的营销策略、内容创作、客户服务。从社交媒体管理到客户关系维护，AI让营销运营事半功倍。',
            'service-finance-title': 'AI财务与法务',
            'service-finance-desc': 'AI辅助的财务管理、税务规划、法律咨询。从记账报税到合同审查，AI工具确保合规经营。',
            'service-customer-title': 'AI客户服务',
            'service-customer-desc': '智能客服系统、客户数据分析、个性化推荐。24/7全天候服务，AI让客户体验更上一层楼。',
            'portfolio-title': 'AI赋能成功案例',
            'portfolio-desc': '看看AI如何帮助一人公司实现突破',
            'portfolio-case1-title': 'AI内容创作工作室',
            'portfolio-case1-desc': '利用ChatGPT和Jasper，一人运营的内容创作公司，月收入突破10万',
            'portfolio-case2-title': 'AI设计服务公司',
            'portfolio-case2-desc': '结合Midjourney和Canva AI，提供专业设计服务，客户遍布全球',
            'portfolio-case3-title': 'AI技术咨询公司',
            'portfolio-case3-desc': '使用GitHub Copilot和Cursor，快速为客户开发定制化解决方案',
            'contact-title': '联系我们',
            'contact-desc': '让我们一起创造非凡',
            'contact-email-title': '邮箱',
            'contact-phone-title': '电话',
            'contact-address-title': '地址',
            'form-submit': '发送消息',
            'footer-title': '量子工作室',
            'footer-home': '首页',
            'footer-about': '关于',
            'footer-services': '服务',
            'footer-portfolio': '作品',
            'footer-contact': '联系',
            'footer-copyright': '&copy; 2024 量子工作室. 保留所有权利.',
            'form-name': '您的姓名',
            'form-email': '邮箱地址',
            'form-message': '项目描述'
        },
        en: {
            'site-title': 'Qubit Studio',
            'nav-home': 'Home',
            'nav-about': 'About',
            'nav-services': 'Services',
            'nav-portfolio': 'Portfolio',
            'nav-contact': 'Contact',
            'hero-title': 'AI Empowerment.<br>Solo Company.',
            'hero-subtitle': 'Empower yourself with AI tools and create business miracles solo.',
            'learn-ai-tools': 'Learn AI Tools',
            'start-ai-business': 'Start Your AI Business',
            'about-title': 'About Quantum Studio',
            'about-desc': 'In the AI era, solo companies can create infinite possibilities',
            'about-subtitle': 'AI Empowers, Entrepreneurship Made Simple',
            'about-p1': 'Quantum Studio focuses on helping solo entrepreneurs use AI tools to create and run one-person companies. We believe that with AI, one person can accomplish what used to require a team, realizing the true dream of a "solo company".',
            'about-p2': 'From idea to product, from branding to marketing, from customer service to finance, AI is reshaping every aspect of entrepreneurship. We help founders master these tools for greater efficiency and success.',
            'about-tools': 'AI Tools Recommended',
            'about-cases': 'Success Cases',
            'about-efficiency': 'Efficiency Boost',
            'services-title': 'AI-Powered Solo Company',
            'services-desc': 'From idea to success, AI helps you build the perfect solo company',
            'service-creative-title': 'AI Creativity & Planning',
            'service-creative-desc': 'Use AI for market research, business model design, and product positioning. From idea to business plan, AI helps you validate and plan your path quickly.',
            'service-design-title': 'AI Design & Branding',
            'service-design-desc': 'AI-driven branding, logo creation, and visual identity. From company name to full brand image, AI gives you professional-grade design.',
            'service-dev-title': 'AI Tech Development',
            'service-dev-desc': 'AI-assisted web/app development and automation. From code generation to deployment, AI makes tech easy and efficient.',
            'service-marketing-title': 'AI Marketing & Operations',
            'service-marketing-desc': 'AI-driven marketing, content creation, and customer service. From social media to CRM, AI makes operations more effective.',
            'service-finance-title': 'AI Finance & Legal',
            'service-finance-desc': 'AI-assisted finance, tax, and legal consulting. From bookkeeping to contract review, AI ensures compliance.',
            'service-customer-title': 'AI Customer Service',
            'service-customer-desc': 'Smart customer service, data analysis, and personalized recommendations. 24/7 service, AI elevates customer experience.',
            'portfolio-title': 'AI Success Stories',
            'portfolio-desc': 'See how AI helps solo companies break through',
            'portfolio-case1-title': 'AI Content Studio',
            'portfolio-case1-desc': 'Using ChatGPT and Jasper, a solo content studio achieves 100k+ monthly revenue',
            'portfolio-case2-title': 'AI Design Agency',
            'portfolio-case2-desc': 'With Midjourney and Canva AI, provides professional design services to global clients',
            'portfolio-case3-title': 'AI Tech Consulting',
            'portfolio-case3-desc': 'Using GitHub Copilot and Cursor, delivers custom solutions for clients quickly',
            'contact-title': 'Contact Us',
            'contact-desc': 'Let\'s create something extraordinary together',
            'contact-email-title': 'Email',
            'contact-phone-title': 'Phone',
            'contact-address-title': 'Address',
            'form-submit': 'Send Message',
            'footer-title': 'Qubit Studio',
            'footer-home': 'Home',
            'footer-about': 'About',
            'footer-services': 'Services',
            'footer-portfolio': 'Portfolio',
            'footer-contact': 'Contact',
            'footer-copyright': '&copy; 2024 Qubit Studio. All rights reserved.',
            'form-name': 'Your Name',
            'form-email': 'Email Address',
            'form-message': 'Project Description'
        }
    };

    let currentLang = 'zh';
    const translateBtn = document.getElementById('translate-btn');

    function setLanguage(lang) {
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        // 切换表单 placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });
        // 按钮文字切换
        if (translateBtn) {
            translateBtn.textContent = lang === 'zh' ? 'English' : '中文';
        }
    }

    if (translateBtn) {
        translateBtn.addEventListener('click', function() {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            setLanguage(currentLang);
        });
    }
    // 页面加载时初始化语言
    setLanguage(currentLang);
}); 