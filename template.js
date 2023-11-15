let canvas, g;
const defaultPositionX = 100;
const defaultEnemyPositionX = 600;
const defaultPositionY = 400;
let characterPosX, characterPosY, characterImage, characterR; // 自キャラ関連の変数
let enemyPosX, enemyPosY, enemyImage, enemySpeed, enemyR; // 敵関連の変数
let speed, acceleraiton;
let score;
let scene;
let frameCount;
let bound;

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
    speed              = 0;
    acceleraiton       = 0;
    characterPosX      = defaultPositionX;
    characterPosY      = defaultPositionY;
    characterR         = 16; // 接触判定用の半径
    characterImage     = new Image();
    characterImage.src = "./asset/reimu.png";

    // 敵の初期化
    enemyPosX      = defaultEnemyPositionX; // 右画面外
    enemyPosY      = defaultPositionY;
    enemyR         = 16; // 接触判定用の半径
    enemyImage     = new Image();
    enemyImage.src = "./asset/marisa.png";
    enemySpeed     = 5;

    // ゲーム管理データの初期化
    score      = 0;
    frameCount = 0;
    bound      = false;
    scene      = Scenes.GameMain;
}

function keydown(e) {
    // 地面にいない場合はジャンプしない
    if (characterPosY < defaultPositionY) {
        return;
    }
    // Y軸方向への1フレームあたりの移動量
    speed = -20;
    // (重力)
    acceleraiton = 1.5;
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
        speed = speed + acceleraiton;
        characterPosY = characterPosY + speed;
        // 地面に着いたら速度と加速度を0にする
        if (characterPosY > defaultPositionY) {
            characterPosY = defaultPositionY;
            speed         = 0;
            acceleraiton  = 0;
        }

        // 敵の状態更新
        enemyPosX -= enemySpeed;
        if (enemyPosX < -100) {
            enemyPosX = defaultEnemyPositionX;
            // 敵が画面外に出たらスコアを加算
            score += 100;
        }

        // 自キャラと敵キャラの接触判定
        let diffX = characterPosX - enemyPosX;
        let diffY = characterPosY - enemyPosY;
        // 2点間の距離を求める(3平方の定理)
        let distance = Math.sqrt(diffX * diffX + diffY * diffY);
        // (当たった時の処理)自キャラと敵キャラの距離が半径の和より小さい場合は接触している
        if (distance < characterR + enemyR) {
            scene        = Scenes.GameOver;
            speed        = -20;
            acceleraiton = 0.5;
            frameCount   = 0;
        }
    } else if (scene === Scenes.GameOver) {
        // ゲームオーバー
        // 自キャラの状態更新
        speed         += acceleraiton;
        characterPosY += speed;
        if (characterPosX < 20 || characterPosX > 460) {
            // 画面端に移動したらバウンド
            bound = !bound;
        }
        if (bound) {
            characterPosX += 30;
        } else {
            characterPosX -= 30;
        }

        // 敵キャラの状態更新
        enemyPosX += enemySpeed;
    }

    // 現在何フレーム目かを記録
    frameCount++;
}

/**
 * キャラクターを描画する
 */
function draw() {
    // 画面を黒でクリア
    g.fillStyle = "rgb(0, 0, 0)";
    g.fillRect(0, 0, 480, 480);

    // 自キャラ描画
    g.drawImage(
        characterImage,
        characterPosX - characterImage.width / 2,
        characterPosY - characterImage.height / 2
    );

    // 敵キャラ描画
    g.drawImage(
        enemyImage,
        enemyPosX - enemyImage.width / 2,
        enemyPosY - enemyImage.height / 2
    );

    // スコア表示
    g.fillStyle         = "rgb(255, 255, 255)";
    g.font              = "16px Arial";
    let scoreLabel      = "SCORE: " + score;
    let scoreLabelWidth = g.measureText(scoreLabel).width; // スコアの文字列の幅を取得
    g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);
}
