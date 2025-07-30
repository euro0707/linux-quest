class LinuxQuestGame {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.hintText = document.getElementById('hintText');
        this.sageMessage = document.getElementById('sageMessage');
        
        this.currentPath = '/home/quest';
        this.completedTasks = new Set();
        this.commandHistory = [];
        
        // 仮想ファイルシステム
        this.fileSystem = {
            '/home/quest': {
                'documents': { type: 'directory' },
                'downloads': { type: 'directory' },
                'pictures': { type: 'directory' },
                'music': { type: 'directory' },
                'quest_log.txt': { type: 'file', content: 'Linux Quest への旅路が始まった...' },
                'README.md': { type: 'file', content: 'Linux Quest Day1 へようこそ！' }
            }
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            }
        });
        
        this.commandInput.focus();
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addTerminalLine('', 'ターミナルの使い方：コマンドを入力してEnterキーを押してください');
        }, 1000);
    }
    
    executeCommand() {
        const command = this.commandInput.value.trim();
        if (!command) return;
        
        // コマンドをターミナルに表示
        this.addTerminalLine('quest@linux:~$', command, 'user-input');
        
        // コマンド履歴に追加
        this.commandHistory.push(command);
        
        // コマンドを解析して実行
        this.processCommand(command);
        
        // 入力フィールドをクリア
        this.commandInput.value = '';
        
        // ターミナルを下にスクロール
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    processCommand(command) {
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        switch (cmd) {
            case 'echo':
                this.handleEcho(args.slice(1).join(' '));
                break;
            case 'pwd':
                this.handlePwd();
                break;
            case 'ls':
                this.handleLs();
                break;
            case 'clear':
                this.handleClear();
                break;
            case 'help':
                this.handleHelp();
                break;
            case 'history':
                this.handleHistory();
                break;
            default:
                this.handleUnknownCommand(cmd);
        }
    }
    
    handleEcho(text) {
        // クォートを除去
        const cleanText = text.replace(/^["']|["']$/g, '');
        this.addTerminalLine('', cleanText, 'output-text');
        
        if (cleanText.toLowerCase().includes('hello') && cleanText.toLowerCase().includes('linux')) {
            this.completeTask('task-echo');
            this.updateSageMessage('素晴らしい！echoコマンドでコンピューターと会話できた！次はpwdを試してみよう。');
            this.updateHint('次は「pwd」と入力して、現在いる場所を確認してみましょう。');
        }
    }
    
    handlePwd() {
        this.addTerminalLine('', this.currentPath, 'output-text');
        this.completeTask('task-pwd');
        this.updateSageMessage('現在地を確認できた！君は今 ' + this.currentPath + ' にいる。次はlsで周りを見回してみよう。');
        this.updateHint('最後に「ls」と入力して、このディレクトリにあるファイルを見てみましょう。');
    }
    
    handleLs() {
        const files = this.fileSystem[this.currentPath];
        if (files) {
            Object.keys(files).forEach(fileName => {
                const fileInfo = files[fileName];
                const displayName = fileInfo.type === 'directory' ? fileName + '/' : fileName;
                const color = fileInfo.type === 'directory' ? 'color: #00ffff;' : 'color: #ffffff;';
                this.addTerminalLine('', displayName, 'output-text', color);
            });
        }
        
        this.completeTask('task-ls');
        this.updateSageMessage('完璧だ！君は今、この世界にあるものを見ることができた。全てのクエストを達成したぞ！');
        this.updateHint('🎉 おめでとうございます！Day1の全てのクエストが完了しました！');
        
        // 全タスク完了をチェック
        this.checkAllTasksComplete();
    }
    
    handleClear() {
        this.terminal.innerHTML = '';
        this.addTerminalLine('quest@linux:~$', 'ターミナルをクリアしました');
    }
    
    handleHelp() {
        this.addTerminalLine('', '使用可能なコマンド:', 'output-text');
        this.addTerminalLine('', '  echo "テキスト" - テキストを表示', 'output-text');
        this.addTerminalLine('', '  pwd - 現在のディレクトリを表示', 'output-text');
        this.addTerminalLine('', '  ls - ファイル一覧を表示', 'output-text');
        this.addTerminalLine('', '  help - このヘルプを表示', 'output-text');
        this.addTerminalLine('', '  clear - ターミナルをクリア', 'output-text');
        this.addTerminalLine('', '  history - コマンド履歴を表示', 'output-text');
    }
    
    handleHistory() {
        this.addTerminalLine('', 'コマンド履歴:', 'output-text');
        this.commandHistory.forEach((cmd, index) => {
            this.addTerminalLine('', `${index + 1}: ${cmd}`, 'output-text');
        });
    }
    
    handleUnknownCommand(cmd) {
        this.addTerminalLine('', `${cmd}: コマンドが見つかりません`, 'error-text');
        this.addTerminalLine('', 'ヒント: "help" と入力して使用可能なコマンドを確認してください', 'output-text');
    }
    
    addTerminalLine(prompt, text, className = '', style = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (prompt) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = prompt;
            line.appendChild(promptSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.className = className;
        textSpan.textContent = text;
        if (style) textSpan.style.cssText = style;
        line.appendChild(textSpan);
        
        this.terminal.appendChild(line);
    }
    
    completeTask(taskId) {
        if (this.completedTasks.has(taskId)) return;
        
        this.completedTasks.add(taskId);
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            taskElement.classList.add('completed');
            const checkbox = taskElement.querySelector('.checkbox');
            if (checkbox) {
                checkbox.textContent = '☑';
            }
        }
        
        // 完了エフェクト
        this.showCompletionEffect();
    }
    
    checkAllTasksComplete() {
        const mainTasks = ['task-echo', 'task-pwd', 'task-ls'];
        const allComplete = mainTasks.every(task => this.completedTasks.has(task));
        
        if (allComplete) {
            setTimeout(() => {
                this.completeTask('task-complete');
                this.showVictoryMessage();
            }, 1000);
        }
    }
    
    showCompletionEffect() {
        // キラキラエフェクト
        const effect = document.createElement('div');
        effect.textContent = '✨';
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            font-size: 2em;
            pointer-events: none;
            animation: sparkle 1s ease-out forwards;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
        
        // CSS animation for sparkle effect
        if (!document.getElementById('sparkle-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-style';
            style.textContent = `
                @keyframes sparkle {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showVictoryMessage() {
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '🎉🎉🎉 Day1 クエスト完全制覇！ 🎉🎉🎉', 'output-text', 'color: #ffd700; font-weight: bold;');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '君は今日、以下のスキルを習得した：', 'output-text');
        this.addTerminalLine('', '• echoコマンド - コンピューターとの対話', 'output-text');
        this.addTerminalLine('', '• pwdコマンド - 現在地の確認', 'output-text');
        this.addTerminalLine('', '• lsコマンド - ファイル一覧の表示', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '明日はDay2で新たな冒険が待っている！', 'output-text', 'color: #00ffff;');
        
        this.updateSageMessage('おめでとう、勇敢な冒険者よ！君は今日、Linuxの世界への第一歩を踏み出した。明日はさらなる冒険が待っている！');
        this.updateHint('🏆 Day1完了！お疲れ様でした！明日はディレクトリの移動とファイル操作を学びます。');
        
        // メインハブに戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(1);
        }
    }
    
    showReturnButton() {
        const returnButton = document.createElement('button');
        returnButton.textContent = '🏠 メインハブに戻る';
        returnButton.style.cssText = `
            background: linear-gradient(45deg, #ff6b35, #ffd700);
            border: none;
            padding: 15px 30px;
            font-size: 1.2em;
            font-weight: bold;
            color: #000;
            border-radius: 25px;
            cursor: pointer;
            margin: 20px auto;
            display: block;
            animation: pulse 2s infinite;
        `;
        returnButton.onclick = () => {
            window.location.href = '../index.html?completed=1';
        };
        
        document.body.appendChild(returnButton);
    }
    
    updateSageMessage(message) {
        this.sageMessage.textContent = message;
        this.sageMessage.parentElement.style.animation = 'none';
        setTimeout(() => {
            this.sageMessage.parentElement.style.animation = 'pulse 2s ease-in-out';
        }, 10);
    }
    
    updateHint(hint) {
        this.hintText.textContent = hint;
        this.hintText.parentElement.style.animation = 'none';
        setTimeout(() => {
            this.hintText.parentElement.style.animation = 'pulse 2s infinite';
        }, 10);
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new LinuxQuestGame();
});