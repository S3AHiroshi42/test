/**
 * 遊戲音效管理器
 * 提供統一的音效播放、音量控制和音效預加載功能
 */

 class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.music = new Map();
        this.isMuted = false;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.5;
        this.currentMusic = null;
        
        // 音效定義
        this.soundDefinitions = {
            // 通用音效
            'click': { type: 'sfx', method: 'generateClick' },
            'confirm': { type: 'sfx', method: 'generateConfirm' },
            'cancel': { type: 'sfx', method: 'generateCancel' },
            
            // 恐龍遊戲音效
            'dino_jump': { type: 'sfx', method: 'generateJump' },
            'dino_hit': { type: 'sfx', method: 'generateHit' },
            'dino_score': { type: 'sfx', method: 'generateScore' },
            'dino_levelup': { type: 'sfx', method: 'generateLevelUp' },
            
            // 井字棋音效
            'ttt_place': { type: 'sfx', method: 'generatePlace' },
            'ttt_win': { type: 'sfx', method: 'generateWin' },
            'ttt_draw': { type: 'sfx', method: 'generateDraw' },
            'ttt_ai': { type: 'sfx', method: 'generateAI' },
            
            // 打青蛙音效
            'frog_hit': { type: 'sfx', method: 'generateFrogHit' },
            'frog_combo': { type: 'sfx', method: 'generateCombo' },
            'frog_miss': { type: 'sfx', method: 'generateMiss' },
            'frog_time_warning': { type: 'sfx', method: 'generateTimeWarning' },
            
            // 背景音樂
            'bgm_main': { type: 'music', method: 'generateMainBGM' },
            'bgm_game1': { type: 'music', method: 'generateGame1BGM' },
            'bgm_game2': { type: 'music', method: 'generateGame2BGM' },
            'bgm_game3': { type: 'music', method: 'generateGame3BGM' }
        };
        
        this.init();
    }
    
    /**
     * 初始化音頻上下文
     */
    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            console.log('音頻管理器初始化成功');
        } catch (error) {
            console.warn('Web Audio API 不支持，音效功能將被禁用:', error);
        }
    }
    
    /**
     * 預加載所有音效
     */
    async preloadSounds() {
        if (!this.audioContext) return;
        
        for (const [name, definition] of Object.entries(this.soundDefinitions)) {
            try {
                const buffer = await this[definition.method]();
                if (definition.type === 'sfx') {
                    this.sounds.set(name, buffer);
                } else {
                    this.music.set(name, buffer);
                }
            } catch (error) {
                console.warn(`無法生成音效 ${name}:`, error);
            }
        }
        
        console.log(`音效預加載完成: ${this.sounds.size} 個音效, ${this.music.size} 個音樂`);
    }
    
    /**
     * 播放音效
     * @param {string} name - 音效名稱
     * @param {number} volume - 音量 (0-1)
     * @param {number} rate - 播放速率
     */
    playSound(name, volume = this.sfxVolume, rate = 1.0) {
        if (!this.audioContext || this.isMuted || !this.sounds.has(name)) {
            return null;
        }
        
        try {
            const buffer = this.sounds.get(name);
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.playbackRate.value = rate;
            gainNode.gain.value = volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start();
            return source;
        } catch (error) {
            console.warn(`播放音效 ${name} 失敗:`, error);
            return null;
        }
    }
    
    /**
     * 播放背景音樂
     * @param {string} name - 音樂名稱
     * @param {boolean} loop - 是否循環播放
     */
    playMusic(name, loop = true) {
        if (!this.audioContext || this.isMuted || !this.music.has(name)) {
            return null;
        }
        
        // 停止當前音樂
        this.stopMusic();
        
        try {
            const buffer = this.music.get(name);
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.loop = loop;
            gainNode.gain.value = this.musicVolume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start();
            this.currentMusic = { source, gainNode, name };
            return source;
        } catch (error) {
            console.warn(`播放音樂 ${name} 失敗:`, error);
            return null;
        }
    }
    
    /**
     * 停止當前音樂
     */
    stopMusic() {
        if (this.currentMusic && this.currentMusic.source) {
            try {
                this.currentMusic.source.stop();
            } catch (error) {
                // 忽略已經停止的錯誤
            }
            this.currentMusic = null;
        }
    }
    
    /**
     * 設置音效音量
     * @param {number} volume - 音量 (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * 設置音樂音量
     * @param {number} volume - 音量 (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic && this.currentMusic.gainNode) {
            this.currentMusic.gainNode.gain.value = this.musicVolume;
        }
    }
    
    /**
     * 靜音/取消靜音
     * @param {boolean} muted - 是否靜音
     */
    setMuted(muted) {
        this.isMuted = muted;
        if (muted) {
            this.stopMusic();
        }
    }
    
    /**
     * 切換靜音狀態
     */
    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }
    
    // ==================== 音效生成函數 ====================
    
    /**
     * 生成點擊音效
     */
    async generateClick() {
        return this.generateTone(800, 0.1, 'sine');
    }
    
    /**
     * 生成確認音效
     */
    async generateConfirm() {
        return this.generateTone(1200, 0.2, 'sine');
    }
    
    /**
     * 生成取消音效
     */
    async generateCancel() {
        return this.generateTone(400, 0.2, 'sine');
    }
    
    /**
     * 生成跳躍音效
     */
    async generateJump() {
        return this.generateTone(600, 0.15, 'sine', 1200);
    }
    
    /**
     * 生成碰撞音效
     */
    async generateHit() {
        return this.generateNoise(0.3, 0.5);
    }
    
    /**
     * 生成得分音效
     */
    async generateScore() {
        return this.generateToneSequence([800, 1000, 1200], 0.08);
    }
    
    /**
     * 生成升級音效
     */
    async generateLevelUp() {
        return this.generateToneSequence([600, 800, 1000, 1200], 0.1);
    }
    
    /**
     * 生成放置棋子音效
     */
    async generatePlace() {
        return this.generateTone(1000, 0.1, 'square');
    }
    
    /**
     * 生成勝利音效
     */
    async generateWin() {
        return this.generateToneSequence([800, 1000, 1200, 1000, 800], 0.1);
    }
    
    /**
     * 生成平局音效
     */
    async generateDraw() {
        return this.generateTone(500, 0.3, 'sine');
    }
    
    /**
     * 生成AI思考音效
     */
    async generateAI() {
        return this.generateTone(300, 0.2, 'sawtooth');
    }
    
    /**
     * 生成青蛙點擊音效
     */
    async generateFrogHit() {
        return this.generateTone(900, 0.1, 'sine');
    }
    
    /**
     * 生成連擊音效
     */
    async generateCombo() {
        return this.generateToneSequence([1000, 1200, 1400], 0.05);
    }
    
    /**
     * 生成錯過音效
     */
    async generateMiss() {
        return this.generateTone(300, 0.2, 'sine');
    }
    
    /**
     * 生成時間警告音效
     */
    async generateTimeWarning() {
        return this.generateTone(400, 0.5, 'square');
    }
    
    /**
     * 生成主菜單背景音樂
     */
    async generateMainBGM() {
        return this.generateBGM(120, 10, 'sine');
    }
    
    /**
     * 生成恐龍遊戲背景音樂
     */
    async generateGame1BGM() {
        return this.generateBGM(140, 8, 'triangle');
    }
    
    /**
     * 生成井字棋背景音樂
     */
    async generateGame2BGM() {
        return this.generateBGM(100, 12, 'sine');
    }
    
    /**
     * 生成打青蛙背景音樂
     */
    async generateGame3BGM() {
        return this.generateBGM(160, 6, 'square');
    }
    
    // ==================== 音頻生成工具函數 ====================
    
    /**
     * 生成單音調
     */
    async generateTone(frequency, duration, type = 'sine', endFrequency = null) {
        return new Promise((resolve) => {
            if (!this.audioContext) {
                resolve(null);
                return;
            }
            
            const sampleRate = this.audioContext.sampleRate;
            const frameCount = Math.floor(sampleRate * duration);
            const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
            const channelData = buffer.getChannelData(0);
            
            for (let i = 0; i < frameCount; i++) {
                const progress = i / frameCount;
                const currentFreq = endFrequency 
                    ? frequency + (endFrequency - frequency) * progress
                    : frequency;
                
                const value = Math.sin(2 * Math.PI * currentFreq * i / sampleRate);
                
                // 應用包絡線
                const attack = 0.1;
                const release = 0.2;
                let envelope = 1.0;
                
                if (progress < attack) {
                    envelope = progress / attack;
                } else if (progress > 1 - release) {
                    envelope = (1 - progress) / release;
                }
                
                channelData[i] = value * envelope;
            }
            
            resolve(buffer);
        });
    }
    
    /**
     * 生成音調序列
     */
    async generateToneSequence(frequencies, durationPerTone) {
        return new Promise((resolve) => {
            if (!this.audioContext) {
                resolve(null);
                return;
            }
            
            const sampleRate = this.audioContext.sampleRate;
            const totalDuration = frequencies.length * durationPerTone;
            const frameCount = Math.floor(sampleRate * totalDuration);
            const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
            const channelData = buffer.getChannelData(0);
            
            let frameIndex = 0;
            
            for (let toneIndex = 0; toneIndex < frequencies.length; toneIndex++) {
                const frequency = frequencies[toneIndex];
                const toneFrameCount = Math.floor(sampleRate * durationPerTone);
                
                for (let i = 0; i < toneFrameCount && frameIndex < frameCount; i++, frameIndex++) {
                    const progress = i / toneFrameCount;
                    const value = Math.sin(2 * Math.PI * frequency * i / sampleRate);
                    
                    // 應用包絡線
                    const attack = 0.1;
                    const release = 0.2;
                    let envelope = 1.0;
                    
                    if (progress < attack) {
                        envelope = progress / attack;
                    } else if (progress > 1 - release) {
                        envelope = (1 - progress) / release;
                    }
                    
                    channelData[frameIndex] = value * envelope;
                }
            }
            
            resolve(buffer);
        });
    }
    
    /**
     * 生成噪音
     */
    async generateNoise(duration, volume = 0.5) {
        return new Promise((resolve) => {
            if (!this.audioContext) {
                resolve(null);
                return;
            }
            
            const sampleRate = this.audioContext.sampleRate;
            const frameCount = Math.floor(sampleRate * duration);
            const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
            const channelData = buffer.getChannelData(0);
            
            for (let i = 0; i < frameCount; i++) {
                const progress = i / frameCount;
                const value = (Math.random() * 2 - 1) * volume;
                
                // 應用包絡線
                const attack = 0.1;
                const release = 0.3;
                let envelope = 1.0;
                
                if (progress < attack) {
                    envelope = progress / attack;
                } else if (progress > 1 - release) {
                    envelope = (1 - progress) / release;
                }
                
                channelData[i] = value * envelope;
            }
            
            resolve(buffer);
        });
    }
    
    /**
     * 生成背景音樂
     */
    async generateBGM(bpm, duration, waveType = 'sine') {
        return new Promise((resolve) => {
            if (!this.audioContext) {
                resolve(null);
                return;
            }
            
            const sampleRate = this.audioContext.sampleRate;
            const frameCount = Math.floor(sampleRate * duration);
            const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
            const channelData = buffer.getChannelData(0);
            
            const beatDuration = 60 / bpm; // 每拍秒數
            const notes = [
                { freq: 440, duration: beatDuration * 4 }, // A4
                { freq: 493.88, duration: beatDuration * 2 }, // B4
                { freq: 523.25, duration: beatDuration * 2 }, // C5
                { freq: 587.33, duration: beatDuration * 4 }, // D5
            ];
            
            let frameIndex = 0;
            let noteIndex = 0;
            
            while (frameIndex < frameCount) {
                const note = notes[noteIndex % notes.length];
                const noteFrameCount = Math.floor(sampleRate * note.duration);
                
                for (let i = 0; i < noteFrameCount && frameIndex < frameCount; i++, frameIndex++) {
                    const progress = i / noteFrameCount;
                    
                    // 生成波形
                    let value;
                    switch (waveType) {
                        case 'sine':
                            value = Math.sin(2 * Math.PI * note.freq * i / sampleRate);
                            break;
                        case 'square':
                            value = Math.sin(2 * Math.PI * note.freq * i / sampleRate) > 0 ? 0.5 : -0.5;
                            break;
                        case 'triangle':
                            const phase = (note.freq * i / sampleRate) % 1;
                            value = phase < 0.25 ? phase * 4 :
                                   phase < 0.75 ? 1 - (phase - 0.25) * 2 :
                                   (phase - 0.75) * 4 - 1;
                            break;
                        case 'sawtooth':
                            value = 2 * ((note.freq * i / sampleRate) % 1) - 1;
                            break;
                        default:
                            value = Math.sin(2 * Math.PI * note.freq * i / sampleRate);
                    }
                    
                    // 應用包絡線
                    const attack = 0.05;
                    const release = 0.1;
                    let envelope = 1.0;
                    
                    if (progress < attack) {
                        envelope = progress / attack;
                    } else if (progress > 1 - release) {
                        envelope = (1 - progress) / release;
                    }
                    
                    channelData[frameIndex] = value * envelope * 0.3;
                }
                
                noteIndex++;
            }
            
            resolve(buffer);
        });
    }
}

// 創建全局音效管理器實例
window.audioManager = new AudioManager();

// 自動預加載音效
document.addEventListener('DOMContentLoaded', () => {
