document.addEventListener('DOMContentLoaded', () => {
    // 開運メッセージの配列
    const fortuneMessages = [
        '今日は素晴らしい一日になりますように！',
        '小さな一歩が大きな成功につながります',
        'あなたの努力は必ず報われます',
        '新しい出会いが運を運んできます',
        'チャンスは準備ができた人に訪れます',
        'ポジティブな気持ちでいると幸運が舞い込みます',
        '今日の頑張りが明日の笑顔を作ります',
        '一呼吸おいて、リラックスしましょう',
        'あなたの周りにはたくさんの幸せがあります',
        '今日も一日お疲れ様でした！'
    ];
    
    // ランダムなメッセージを取得する関数
    function getRandomFortune() {
        const randomIndex = Math.floor(Math.random() * fortuneMessages.length);
        return fortuneMessages[randomIndex];
    }
    
    // メッセージを表示する関数
    function showFortuneMessage() {
        const messageElement = document.getElementById('fortune-message');
        messageElement.textContent = getRandomFortune();
        messageElement.classList.add('show');
        
        // 5秒後にメッセージを非表示にする
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 5000);
    }
    // 要素の取得
    const timerDisplay = document.querySelector('.timer-display');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    // タイマー変数
    let timeLeft = 25 * 60; // 25分を秒で表示
    let timerId;
    let isRunning = false;
    let currentMode = 'pomodoro';
    
    // モードごとの時間（分）
    const modes = {
        'pomodoro': 25,
        'shortBreak': 5,
        'longBreak': 15
    };
    
    // 時間表示を更新する関数
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // タイマーを開始する関数
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startBtn.textContent = '一時停止';
            
            // 開始時にメッセージを表示
            showFortuneMessage();
            
            timerId = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                    
                    // 残り1分を切ったらアニメーションを追加
                    if (timeLeft <= 10) {
                        timerDisplay.style.animation = 'pulse 1s infinite';
                    }
                } else {
                    clearInterval(timerId);
                    isRunning = false;
                    startBtn.textContent = 'スタート';
                    playSound();
                    
                    // 終了時にメッセージを表示
                    showFortuneMessage();
                    
                    // モードに応じて次のモードを設定
                    if (currentMode === 'pomodoro') {
                        // ポモドーロ後は短い休憩
                        setMode('shortBreak');
                    } else {
                        // 休憩後はポモドーロに戻る
                        setMode('pomodoro');
                    }
                }
            }, 1000);
        } else {
            // 一時停止
            clearInterval(timerId);
            isRunning = false;
            startBtn.textContent = '再開';
            timerDisplay.style.animation = 'none';
        }
    }
    
    // タイマーをリセットする関数
    function resetTimer() {
        clearInterval(timerId);
        isRunning = false;
        startBtn.textContent = 'スタート';
        timerDisplay.style.animation = 'none';
        
        // 現在のモードに応じて時間をリセット
        switch(currentMode) {
            case 'pomodoro':
                timeLeft = modes.pomodoro * 60;
                break;
            case 'shortBreak':
                timeLeft = modes.shortBreak * 60;
                break;
            case 'longBreak':
                timeLeft = modes.longBreak * 60;
                break;
        }
        
        updateDisplay();
        
        // リセット時にメッセージを表示
        showFortuneMessage();
    }
    
    // モードを設定する関数
    function setMode(mode) {
        // 現在のアクティブなボタンを非アクティブに
        document.querySelector('.mode-btn.active').classList.remove('active');
        
        // モードに応じて時間を設定
        switch(mode) {
            case 'pomodoro':
                timeLeft = modes.pomodoro * 60;
                currentMode = 'pomodoro';
                document.querySelector('[data-minutes="25"]').classList.add('active');
                break;
            case 'shortBreak':
                timeLeft = modes.shortBreak * 60;
                currentMode = 'shortBreak';
                document.querySelector('[data-minutes="5"]').classList.add('active');
                break;
            case 'longBreak':
                timeLeft = modes.longBreak * 60;
                currentMode = 'longBreak';
                document.querySelector('[data-minutes="15"]').classList.add('active');
                break;
        }
        
        // タイマーをリセット
        resetTimer();
    }
    
    // 効果音を再生する関数
    function playSound() {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play().catch(e => console.log('音声の再生に失敗しました:', e));
    }
    
    // イベントリスナー
    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // モード選択ボタンにイベントリスナーを追加
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const minutes = parseInt(button.getAttribute('data-minutes'));
            if (minutes === 25) setMode('pomodoro');
            else if (minutes === 5) setMode('shortBreak');
            else if (minutes === 15) setMode('longBreak');
        });
    });
    
    // 初期表示
    updateDisplay();
    
    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            startTimer();
        } else if (e.code === 'KeyR') {
            resetTimer();
        } else if (e.code === 'Digit1') {
            setMode('pomodoro');
        } else if (e.code === 'Digit2') {
            setMode('shortBreak');
        } else if (e.code === 'Digit3') {
            setMode('longBreak');
        }
    });
});
