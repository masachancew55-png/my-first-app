document.addEventListener('DOMContentLoaded', function() {
    // スムーススクロール機能
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // スキルバーのアニメーション
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.querySelector('#skills');

    function animateSkillBars() {
        const sectionTop = skillsSection.offsetTop;
        const sectionHeight = skillsSection.offsetHeight;
        const scrollPosition = window.pageYOffset + window.innerHeight;

        if (scrollPosition > sectionTop + sectionHeight / 2) {
            skillBars.forEach(bar => {
                const skillLevel = bar.getAttribute('data-width');
                bar.style.width = skillLevel + '%';
            });
        }
    }

    // スクロールイベントでスキルバーを実行
    window.addEventListener('scroll', animateSkillBars);

    // 「挨拶をクリック」ボタンの機能
    const greetingBtn = document.getElementById('greeting-btn');
    
    if (greetingBtn) {
        greetingBtn.addEventListener('click', function() {
            const messages = [
                'こんにちは！武光真幸です！',
                '国際物流の分野で30年以上の経験があります！',
                'プログラミングにも挑戦しています！',
                'どうぞよろしくお願いします！'
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            alert(randomMessage);
        });
    }

    // 「メッセージを送る」ボタンの機能
    const contactBtn = document.getElementById('contact-btn');
    
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            const name = prompt('お名前を教えてください：');
            if (name) {
                const message = prompt('メッセージをどうぞ：');
                if (message) {
                    alert(`${name}さん、メッセージありがとうございます！\n\n「${message}」\n\n内容を確認次第、ご連絡いたします。`);
                }
            }
        });
    }

    // ページ読み込み時のフェードインアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を監視
    const animatedElements = document.querySelectorAll('.about-content, .skills-grid, .contact-content');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ナビゲーションのアクティブ状態管理
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });

    // ヘッダーの背景透明度を調整
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // モバイルデバイス対応のタッチイベント
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    console.log('自己紹介サイトが正常に読み込まれました！');
});