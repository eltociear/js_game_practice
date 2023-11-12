let canvas, g;
const defaultPositionX = 100;
const defaultEnemyPositionX = 600;
const defaultPositionY = 400;
let characterPosX, characterPosY, characterImage; // 自キャラ関連の変数
let enemyPosX, enemyPosY, enemyImage, enemySpeed; // 敵関連の変数
let speed, acceleraiton;

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
    characterImage     = new Image();
    characterImage.src = "./reimu.png";

    // 敵の初期化
    enemyPosX      = defaultEnemyPositionX; // 右画面外
    enemyPosY      = defaultPositionY;
    enemyR         = 16;
    enemyImage     = new Image();
    enemyImage.src = "./marisa.png";
    enemySpeed     = 5;
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
    speed = speed + acceleraiton;
    characterPosY = characterPosY + speed;
    // 地面に着いたら速度と加速度を0にする
    if (characterPosY > defaultPositionY) {
        characterPosY = defaultPositionY;
        speed = 0;
        acceleraiton = 0;
    }

    // 敵の移動
    enemyPosX -= enemySpeed;
    if (enemyPosX < -100) {
        enemyPosX = defaultEnemyPositionX;
    }
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
}
