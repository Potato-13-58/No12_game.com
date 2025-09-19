const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: canvas.height / 2 - 25,
    width: 20,
    height: 50,
    speed: 5,
    dy: 0,
};

const obstacles = [];
let obstacleSpeed = 2; // 初期障害物スピード
let score = 0;

// 障害物を生成する関数
function createObstacle() {
    const height = Math.random() * 50 + 20; // ランダムな高さ
    const y = Math.random() * (canvas.height - height); // ランダムな位置
    obstacles.push({
        x: canvas.width,
        y,
        width: 20,
        height,
    });
}

// 障害物を更新する関数
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= obstacleSpeed;

        // 障害物が画面外に出たら削除
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            score += 100; // スコア加算
        }
    }

    // スコアが1000増えるごとに障害物のスピードを上げる
    if (score % 1000 === 0 && score !== 0) {
        obstacleSpeed += 1; // スピードアップ
    }
}

// 障害物を描画する関数
function drawObstacles() {
    ctx.fillStyle = '#f00';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// プレイヤーを更新する関数
function updatePlayer() {
    player.y += player.dy;

    // プレイヤーが画面外に出ないように制限
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// プレイヤーを描画する関数
function drawPlayer() {
    ctx.fillStyle = '#00f';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// スコアを描画する関数
function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// キー入力処理
document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        player.dy = -player.speed; // 上に移動
    } else if (e.key === 's' || e.key === 'S') {
        player.dy = player.speed; // 下に移動
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
        player.dy = 0; // 停止
    }
});

// ゲームループ
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア

    updatePlayer(); // プレイヤー更新
    drawPlayer(); // プレイヤー描画

    updateObstacles(); // 障害物更新
    drawObstacles(); // 障害物描画

    drawScore(); // スコア描画

    requestAnimationFrame(gameLoop); // 次のフレームを呼び出し
}

// 障害物を定期的に生成
setInterval(createObstacle, 2000); // 2秒ごとに障害物を生成

// ゲーム開始
gameLoop();

/// 効果音の要素を取得
const gameOverSound = document.getElementById('gameOverSound');
const itemPickupSound = document.getElementById('itemPickupSound');

// 初回クリックで音声を準備
document.addEventListener('click', () => {
    gameOverSound.play().catch(() => {});
    itemPickupSound.play().catch(() => {});
}, { once: true });

// ゲームオーバー時に効果音を再生
function handleGameOver() {
    gameOverSound.currentTime = 0; // 再生位置をリセット
    gameOverSound.play().catch((error) => console.error('再生エラー:', error));
    alert('ゲームオーバー');
    resetGame();
}

// アイテム獲得時に効果音を再生
function handleItemPickup(item) {
    itemPickupSound.currentTime = 0; // 再生位置をリセット
    itemPickupSound.play().catch((error) => console.error('再生エラー:', error));
    console.log(`${item.color}のアイテムを獲得！`);
}
// 既存のコード...

let timer = 0;

// 新しい関数: タイマーを更新して表示
function updateTimer() {
    const seconds = Math.floor(timer / 60); // 1秒ごとに増加
    document.getElementById('timer').textContent = seconds;
}

// ゲームのメインループにタイマー更新を追加
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateObstacles();
    updatePowerUps();

    drawPlayer();
    drawObstacles();
    drawPowerUps();

    checkCollision();
    updateScore();
    timer++; // タイマーをインクリメント
    updateTimer(); // タイマーを更新して表示

    if (timer % 100 === 0) {
        generateObstacle();
        if (Math.random() < 0.5) generatePowerUp(); // 50%の確率でパワーアップ生成
    }

    requestAnimationFrame(gameLoop);
}

// タイマーを更新して表示
function updateTimer() {
    const seconds = Math.floor(timer / 60); // 1秒ごとに増加
    document.getElementById('timer').textContent = seconds;
}

// モーダルの表示と非表示
function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeSettingsModal() {
    var settingsModal = document.getElementById('settingsModal');
    var overlay = document.getElementById('overlay');
    
    if (settingsModal) settingsModal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

// 設定ボタンをクリックしたときの処理
document.getElementById('settingsButton').addEventListener('click', openSettingsModal);

// 効果音とBGMのミュート設定
const muteSounds = document.getElementById('muteSounds');
const muteBGM = document.getElementById('muteBGM');

muteSounds.addEventListener('change', function() {
    const sounds = [].slice.call(document.querySelectorAll('audio:not(#bgm)'));
    sounds.forEach(sound => {
        sound.muted = muteSounds.checked;
    });
});

muteBGM.addEventListener('change', function() {
    const bgm = document.getElementById('bgm');
    bgm.muted = muteBGM.checked;
});

// DOMContentLoaded イベントで初期設定
document.addEventListener('DOMContentLoaded', function() {
    // 既存の初期化処理をここに...
    // 設定の初期化
    muteSounds.checked = localStorage.getItem('muteSounds') === 'true';
    muteBGM.checked = localStorage.getItem('muteBGM') === 'true';
    
    // 初期設定を適用
    muteSounds.dispatchEvent(new Event('change'));
    muteBGM.dispatchEvent(new Event('change'));
});

// 設定を保存
function saveSettings() {
    localStorage.setItem('muteSounds', muteSounds.checked);
    localStorage.setItem('muteBGM', muteBGM.checked);
}

// モーダルを閉じるときに設定を保存
document.getElementById('settingsModal').querySelector('button').addEventListener('click', saveSettings);

// 既存のコードの残り...

// 既存のコードの残り...
