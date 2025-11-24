class WoodenFish {
    constructor() {
        this.count = 0;
        this.woodenFish = document.getElementById('woodenFish');
        this.countElement = document.getElementById('count');
        
        this.init();
    }

    init() {
        // 创建音频上下文
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 绑定点击事件
        this.woodenFish.addEventListener('click', (event) => this.strike(event));
        
        // 绑定键盘事件（空格键）
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.strike();
            }
        });

        // 预加载音效
        this.preloadSound();
    }

    async preloadSound() {
        // 使用在线木鱼音效
        try {
            const response = await fetch('https://assets.mixkit.co/active_storage/sfx/247/247-preview.mp3');
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.log('使用备用音效生成方式');
        }
    }

    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.left = (x - 30) + 'px';
        effect.style.top = (y - 30) + 'px';
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 600);
    }

    playSound() {
        if (this.audioBuffer) {
            // 使用预加载的音效
            const source = this.audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.connect(this.audioContext.destination);
            source.start();
        } else {
            // 备用：使用振荡器生成木鱼类似声音
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(180, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.3);
        }
    }

    strike(event) {
        // 更新功德计数
        this.count += 1;
        this.countElement.textContent = this.count;
        
        // 添加数字跳动动画
        this.countElement.classList.remove('merit-pop');
        void this.countElement.offsetWidth; // 触发重绘
        this.countElement.classList.add('merit-pop');
        
        // 播放声音
        this.playSound();
        
        // 创建点击效果
        if (event) {
            const rect = this.woodenFish.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.createClickEffect(x + rect.left, y + rect.top);
        }
        
        // 添加视觉反馈
        this.woodenFish.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.woodenFish.style.transform = 'scale(1)';
        }, 100);
    }
}

// 初始化电子木鱼
document.addEventListener('DOMContentLoaded', () => {
    new WoodenFish();
});