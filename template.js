let canvas, g;
const defaultPositionX = 100;
const defaultEnemyPositionX = 600;
const defaultPositionY = 400;
let player, enemy;
let score;
let scene;
let frameCount;
let bound;
let particles;

const Scenes = {
    GameMain: "GameMain",
    GameOver: "GameOver",
};

onload = function () {
    // 描画コンテキストの取得
    canvas = document.getElementById("gamecanvas");
    g = canvas.getContext("2d");
    // 初期化
    init();
    // 入力処理の指定
    document.onkeydown = keydown;
    // ゲームループの設定 60FPS
    setInterval("gameloop()", 16);
};

/**
 * ゲームの初期化
 */
function init() {
    // 自キャラの初期化
    player              = new Sprite();
    player.image        = new Image();
    player.image.src    = "./asset/reimu.png";
    player.posX         = defaultPositionX;
    player.posY         = defaultPositionY;
    player.speed        = 0;
    player.acceleraiton = 0;
    player.r            = 16; // 接触判定用の半径

    // 敵の初期化
    enemy              = new Sprite();
    enemy.image        = new Image();
    enemy.image.src    = "./asset/marisa.png";
    enemy.posX         = defaultEnemyPositionX; // 右画面外
    enemy.posY         = defaultPositionY;
    enemy.speed        = 5;
    enemy.acceleraiton = 0;
    enemy.r            = 16; // 接触判定用の半径

    // パーティクルの初期化
    particles = [];

    // ゲーム管理データの初期化
    score      = 0;
    frameCount = 0;
    bound      = false;
    scene      = Scenes.GameMain;
}

function keydown(e) {
    // 地面にいない場合はジャンプしない
    if (player.posY < defaultPositionY) {
        return;
    }
    // Y軸方向への1フレームあたりの移動量
    player.speed = -20;
    // (重力)
    player.acceleraiton = 1.5;
}

function gameloop() {
    update();
    draw();
}

/**
 * キャラクターの状態を更新する
 */
function update() {
    if (scene === Scenes.GameMain) {
        // ゲーム中
        player.speed = player.speed + player.acceleraiton;
        player.posY  = player.posY + player.speed;
        // 地面に着いたら速度と加速度を0にする
        if (player.posY > defaultPositionY) {
            player.posY = defaultPositionY;
            player.speed        = 0;
            player.acceleraiton = 0;
        }

        // 敵の状態更新
        enemy.posX -= enemy.speed;
        if (enemy.posX < -100) {
            enemy.posX = defaultEnemyPositionX;
            // 敵が画面外に出たらスコアを加算
            score += 100;
        }

        // 自キャラと敵キャラの接触判定
        let diffX = player.posX - enemy.posX;
        let diffY = player.posY - enemy.posY;
        // 2点間の距離を求める(3平方の定理)
        let distance = Math.sqrt(diffX * diffX + diffY * diffY);
        // (当たった時の処理)自キャラと敵キャラの距離が半径の和より小さい場合は接触している
        if (distance < player.r + enemy.r) {
            scene               = Scenes.GameOver;
            frameCount          = 0;

            // パーティクルの生成
            for (let i = 0; i < 300; i++) {
                particles.push(new Particle(player.posX, player.posY));
            }
        }
    } else if (scene === Scenes.GameOver) {
        // ゲームオーバー
        // パーティクルの更新
        particles.forEach((p) => {
            p.update();
        });

        // 敵キャラの状態更新
        enemy.posX += enemy.speed;
    }

    // 現在何フレーム目かを記録
    frameCount++;
}

/**
 * キャラクターを描画する
 */
function draw() {
    g.imageSmoothingEnabled = false;

    if (scene === Scenes.GameMain) {
        // 画面を黒でクリア
        g.fillStyle = "rgb(0, 0, 0)";
        g.fillRect(0, 0, 480, 480);

        // 自キャラ描画
        player.draw(g);

        // 敵キャラ描画
        enemy.draw(g);

        // スコア表示
        g.fillStyle         = "rgb(255, 255, 255)";
        g.font              = "16px Arial";
        let scoreLabel      = "SCORE: " + score;
        let scoreLabelWidth = g.measureText(scoreLabel).width; // スコアの文字列の幅を取得
        g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);
    } else if (scene === Scenes.GameOver) {
        // 画面を黒でクリア
        g.fillStyle = "rgb(0, 0, 0)";
        g.fillRect(0, 0, 480, 480);

        // パーティクル描画
        particles.forEach((p) => {
            p.draw(g);
        });

        // ゲームオーバー表示
        g.fillStyle = "rgb(255, 255, 255)";
        g.font      = "48px Arial";
        let gameOverLabel = "GAME OVER";
        let gameOverLabelWidth = g.measureText(gameOverLabel).width; // スコアの文字列の幅を取得
        g.fillText(gameOverLabel, 240 - gameOverLabelWidth / 2, 240);
    }
}

// スプライトクラス
class Sprite {
    image        = null;
    posX         = 0;
    posY         = 0;
    speed        = 0;
    acceleraiton = 0;
    r            = 0;

    // 描画処理
    draw(g) {
        g.drawImage(
            this.image,
            this.posX - this.image.width / 2,
            this.posY - this.image.height / 2
        );
    }
}

// パーティクルクラス
class Particle extends Sprite {
    baseLine     = 0;
    acceleraiton = 0;
    speedX       = 0;
    speedY       = 0;

    constructor(x, y) {
        super();
        this.posX         = x;
        this.posY         = y;
        this.baseLine     = 420;
        this.acceleraiton = 0.5;
        let angle         = (Math.PI * 5) / 4 + (Math.PI / 2) * Math.random();
        this.speed        = 5 + Math.random() * 20;
        this.speedX       = this.speed * Math.cos(angle);
        this.speedY       = this.speed * Math.sin(angle);
        this.r            = 2;
    }

    update() {
        this.speedX *= 0.97;
        this.speedY += this.acceleraiton;
        this.posX   += this.speedX;
        this.posY   += this.speedY;
        if (this.posY > this.baseLine) {
            this.posY   = this.baseLine;
            this.speedY = this.speedY * -1 * (Math.random() * 0.5 + 0.3);
        }
    }

    draw(g) {
        g.fillStyle = "rgb(255, 50, 50)";
        g.fillRect(this.posX - this.r, this.posY - this.r, this.r * 2, this.r * 2);
    }
}
