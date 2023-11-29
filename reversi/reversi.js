let canvas, canvas2;
let context;
let ban = [];
let bg;
let strGameover = "";
let gmode;
let lastPx = 10;
let lastPy = 10;
let turn   = true;
let imgr, imgm;
let gameStart = false;
let shiroKuro;

onload = function () {
    // 描画コンテキストの取得
    canvas  = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // 初期化
    init();
};

function init() {
    canvas.addEventListener("click", mouseClick, false);
    canvas.focus();
    canvas = document.getElementById("canvas2");
    bg     = canvas.getContext("2d");

    for (let i = 0; i < 20; i++) {
        ban[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 初期化
    }

    setInterval(TickHandler, 1000);
    gmode = true;
    draw();
}

/**
 * 駒が白黒か画像か決めるやつ（多分不要）
 */
function chggmode() {
    gmode = !gmode;
}

function TickHandler() {
    draw();
    if (turn === true) return;
    if (gameStart === false) return;

    document.title = "comの番" + thinkTime;

    if (thinkTime > 1) {
        // 敵がすぐ打ってくると分かりづらいので思考中っぽい演出
        thinkTime--;
    } else if (thinkTime === 1) {
        // 四隅取れるか確認
        let kazu = yosumi();

        if (kazu === 0) {
            // 四隅取れないなら全チェックして一番裏返るとこをを探す
            kazu = allSearch();
        }
        if (kazu > 0) {
            // 0以上ならそこに打てる
            ban[lastPx][lastPy] = shiroKuro;
        } else {
            // 埋まっている時の処理
            let fullGame = katiMake(); // 勝敗判定
            if (fullGame === 0) {
                strGameover = "あなたの勝ち";
            } else if (fullGame === 1) {
                strGameover = senkou ? "あなたの勝ち" : "私の勝ち";
            } else if (fullGame === 2) {
                strGameover = senkou ? "私の勝ち" : "あなたの勝ち";
            }
            gameStart = false;
        }
        thinkTime--;
    } else {
        // comが打った後にもう一度埋まっていないかを確認し、埋まっていたら勝ち負け判定
        reverce();
        let tmpX = lastPx;
        let tmpY = lastPy;
        shiroKuro = (shiroKuro === 1) ? 2 : 1;

        if (allSearch() === 0) {
            let fullGame = katiMake(); // 勝敗判定
            if (fullGame === 0) {
                strGameover = "あなたの勝ち";
            } else if (fullGame === 1) {
                strGameover = senkou ? "あなたの勝ち" : "私の勝ち";
            } else if (fullGame === 2) {
                strGameover = senkou ? "私の勝ち" : "あなたの勝ち";
            }
            gameStart = false;

            return; // 負け
        }

        lastPx = tmpX;
        lastPy = tmpY;

        // 勝ち負けが確定していないなら次のターン
        document.title = "あなたの番";
        turn = true;
    }
}

function buttonStartClick(sender) {
    strGameover = " ";
    if (sender === "先攻") {
        turn           = true;
        senkou         = true; // 先攻：黒
        thinkTime      = 2;
        document.title = "あなたの番";
    } else {
        turn      = false;
        senkou    = false; // 後攻：白
        thinkTime = 2;
    }

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            ban[x][y] = 0;
        }
    }
    ban[4][4] = 1; ban[3][3] = 1; ban[3][4] = 2; ban[4][3] = 2; // 初期配置に白黒4個置く
    shiroKuro = 1;
    gameStart = true;

    draw();
}

function draw() {
    // 描画
    let width  = canvas.width;
    let height = canvas.height;

    // 背景
    bg.fillStyle = "DarkGreen";
    bg.fillRect(0, 0, width, height);

    bg.strokeStyle = "Black";
    bg.lineWidth   = 2;
    for (let i = 1; i < 9; i++) {
        // 縦線
        bg.beginPath();
        bg.moveTo(i * 75, 0);
        bg.lineTo(i * 75, 600);
        bg.closePath();
        bg.stroke();
    }
    for (let i = 1; i < 9; i++) {
        // 横線
        bg.beginPath();
        bg.moveTo(0, i * 75);
        bg.lineTo(600, i * 75);
        bg.closePath();
        bg.stroke();
    }

    // 駒
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (gmode) {
                if (ban[x][y] === 1) {
                    bg.beginPath();
                    bg.arc(x * 75 + 37, y * 75 + 37, 35, 0, Math.PI * 2);
                    bg.fillStyle = "Black";
                    bg.fill(); // 塗りつぶし
                } else if (ban[x][y] === 2) {
                    bg.beginPath();
                    bg.arc(x * 75 + 37, y * 75 + 37, 35, 0, Math.PI * 2);
                    bg.fillStyle = "White";
                    bg.fill(); // 塗りつぶし
                }
            } else {
                if (ban[x][y] === 1) {
                    bg.drawImage(imgm, x * 75 - 5, y * 75 - 5, 90, 70);
                } else if (ban[x][y] === 2) {
                    bg.drawImage(imgr, x * 75 - 5, y * 75 - 5, 90, 70);
                }
            }
            if (lastPx === x && lastPy === y) {
                bg.strokeStyle = "Red";
                bg.beginPath();
                bg.strokeRect(x * 75 + 37, y * 75 + 37, 0, Math.PI * 2);
                bg.stroke();
            }
        }
    }

    // 終了時
    bg.font      = "30px 'MS UI Gothic'";
    bg.fillStyle = "Red";
    bg.fillText(strGameover, 50, 200);
    render();
}

/**
 * 裏から表へと表示
 */
function render() {
    dat = bg.getImageData(0, 0, 600, 600);
    context.putImageData(dat, 0, 0);
}

const SLEEP = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));
let isRun = false; // 非同期なので重複して動かないようにする
async function mouseClick(e) {
    if (isRun) return;
    isRun = true;
    if (turn === false) {
        isRun = false;
        return;
    }
    if (gameStart === false) {
        isRun = false;
        return;
    }

    let rect = event.target.getBoundingClientRect();
    x = event.clientX - Math.floor(rect.left);
    y = event.clientY - Math.floor(rect.top);

    lastPx = Math.floor(x / 75);
    lastPy = Math.floor(y / 75);
    let lastB = search(0);
    if (lastB === 0) {
        isRun = false;
        return; // 打てない
    }

    ban[lastPx][lastPy] = shiroKuro;
    draw();

    // 1秒待ってから打つ
    const _SLEEP = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await _SLEEP(1000);
    reverce();
    turn = false;
    shiroKuro = (shiroKuro === 1) ? 2 : 1;

    thinkTime = 2;
    draw();
    isRun = false;
}

let blk = 0;
let wht = 0;
function katiMake() {
    blk = 0;
    wht = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (ban[x][y] === 1) blk++;
            if (ban[x][y] === 2) wht++;
        }
    }
    if (blk + whi === 64) {
        return blk > wht ? 1 : 2;
    }

    return 0;
}

/**
 * 四隅に置けるかどうかを調べる
 *
 * @description 普段は多いところにおくが、四隅は優先しておく
 */
function yosumi() {
    let maxX = 0; let maxY = 0;
    lastPx = 0; lastPy = 0;
    let maxK = search(1);

    lastPx = 0; lastPy = 7;
    let h = search(1);
    if (h > maxK) {
        maxK = h;
        maxX = lastPx;
        maxY = lastPy;
    }

    lastPx = 7; lastPy = 0;
    h = search(1);
    if (h > maxK) {
        maxK = h;
        maxX = lastPx;
        maxY = lastPy;
    }

    lastPx = 7; lastPy = 7;
    h = search(1);
    if (h > maxK) {
        maxK = h;
        maxX = lastPx;
        maxY = lastPy;
    }

    if (maxK !== 0) {
        lastPx = maxX;
        lastPy = maxY;
    }

    return maxK;
}

/**
 * 裏返るかどうかを調べて、可能なら裏返す
 */
function reverce() {
    let no = searchUp(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceUp(lastPx, lastPy, shiroKuro, no);
    no = searchDown(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceDown(lastPx, lastPy, shiroKuro, no);
    no = searchLeft(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceLeft(lastPx, lastPy, shiroKuro, no);
    no = searchRight(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceRight(lastPx, lastPy, shiroKuro, no);

    no = searchUpRight(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceUpRight(lastPx, lastPy, shiroKuro, no);
    no = searchRightDown(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceRightDown(lastPx, lastPy, shiroKuro, no);
    no = searchDownLeft(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceDownLeft(lastPx, lastPy, shiroKuro, no);
    no = searchLeftUp(lastPx, lastPy, shiroKuro);
    if (no !== 0) reverceLeftUp(lastPx, lastPy, shiroKuro, no);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function allSearch() {
    let max = 0; let maxX = 0; let maxY = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            lastPx = x; lastPy = y;
            let lastB = search(1);

            if (max <= lastB) {
                if (getRandomInt(2) === 0 || max !== lastB) { // おいても同じ枚数ならランダム
                    max = lastB;
                    maxX = x;
                    maxY = y;
                }
            }
        }
    }

    lastPx = maxX; lastPy = maxY;
    return max;
}

/**
 * 指定したマスの上下左右斜め8方向調べ、何枚裏返るかを返す
 */
function search(t) {
    if (ban[lastPx][lastPy] !== 0 && t === 1) return 0;

    let up = 0;
    up = searchUp(lastPx, lastPy, shiroKuro);
    let down = 0;
    down = searchDown(lastPx, lastPy, shiroKuro);
    let left = 0;
    left = searchLeft(lastPx, lastPy, shiroKuro);
    let right = 0;
    right = searchRight(lastPx, lastPy, shiroKuro);

    let upRight = 0;
    upRight = searchUpRight(lastPx, lastPy, shiroKuro);
    let rightDown = 0;
    rightDown = searchRightDown(lastPx, lastPy, shiroKuro);
    let downLeft = 0;
    downLeft = searchDownLeft(lastPx, lastPy, shiroKuro);
    let leftUp = 0;
    leftUp = searchLeftUp(lastPx, lastPy, shiroKuro);

    let all = up + down + left + right + upRight + rightDown + downLeft + leftUp;
    return all;
}

function searchUp(x, y, b) {
    let count = 0;
    if (y === 0) return 0; // 一番上なら0
    if (ban[x][y - 1] === 0) return 0; // 上が空なら0

    let i = y - 1; // 一個上
    while (i > -1) {
        if (ban[x][i] === 0) return 0; // 途中に空があったら0
        if (b === ban[x][i]) return count; // 挟んでる
        i--;
        count++;
    }
    return 0;
}

function searchDown(x, y, b) {
    let count = 0;
    if (y === 7) return 0; // 一番下なら0
    if (ban[x][y + 1] === 0) return 0; // 下が空なら0

    let i = y + 1; // 一個下
    while (i < 8) {
        if (ban[x][i] === 0) return 0; // 途中に空があったら0
        if (b === ban[x][i]) return count; // 挟んでる
        i++;
        count++;
    }
    return 0;
}

function searchRight(x, y, b) {
    let count = 0;
    if (x === 7) return 0; // 一番右なら0
    if (ban[x + 1][y] === 0) return 0; // 右が空なら0

    let i = x + 1; // 一個右
    while (i < 8) {
        if (ban[i][y] === 0) return 0; // 途中に空があったら0
        if (b === ban[i][y]) return count; // 挟んでる
        i++;
        count++;
    }
    return 0;
}

function searchUpRight(x, y, b) {
    let count = 0;
    if (x === 7 || y === 0) return 0; // 一番右上なら0
    if (ban[x + 1][y - 1] === 0) return 0; // 右上が空なら0

    let i = x + 1; let j = y - 1; // 一個右上
    while (i < 8 && j > -1) {
        if (ban[i][j] === 0) return 0; // 途中に空があったら0
        if (b === ban[i][j]) return count; // 挟んでる
        i++;
        j--;
        count++;
    }
    return 0;
}

function searchDownLeft(x, y, b) {
    let count = 0;
    if (x === 0 || y === 7) return 0; // 一番左下なら0
    if (ban[x - 1][y + 1] === 0) return 0; // 左下が空なら0

    let i = x - 1; let j = y + 1; // 一個左下
    while (i > -1 && j < 8) {
        if (ban[i][j] === 0) return 0; // 途中に空があったら0
        if (b === ban[i][j]) return count; // 挟んでる
        i--;
        j++;
        count++;
    }
    return 0;
}

function searchRightDown(x, y, b) {
    let count = 0;
    if (x === 7 || y === 7) return 0; // 一番右下なら0
    if (ban[x + 1][y + 1] === 0) return 0; // 右下が空なら0

    let i = x + 1; let j = y + 1; // 一個右下
    while (i < 8 && j < 8) {
        if (ban[i][j] === 0) return 0; // 途中に空があったら0
        if (b === ban[i][j]) return count; // 挟んでる
        i++;
        j++;
        count++;
    }
    return 0;
}

function searchLeftUp(x, y, b) {
    let count = 0;
    if (x === 0 || y === 0) return 0; // 一番左上なら0
    if (ban[x - 1][y - 1] === 0) return 0; // 左上が空なら0

    let i = x - 1; let j = y - 1; // 一個左上
    while (i > -1 && j > -1) {
        if (ban[i][j] === 0) return 0; // 途中に空があったら0
        if (b === ban[i][j]) return count; // 挟んでる
        i--;
        j--;
        count++;
    }
    return 0;
}

function searchLeft(x, y, b) {
    let count = 0;
    if (x === 0) return 0; // 一番左なら0
    if (ban[x - 1][y] === 0) return 0; // 左が空なら0

    let i = x - 1; // 一個左
    while (i > -1) {
        if (ban[i][y] === 0) return 0; // 途中に空があったら0
        if (b === ban[i][y]) return count; // 挟んでる
        i--;
        count++;
    }
    return 0;
}

function reverceUp(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x][y - i] = b;
    }
}

function reverceDown(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x][y + i] = b;
    }
}

function reverceLeft(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x - i][y] = b;
    }
}

function reverceRight(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x + i][y] = b;
    }
}

function reverceUpRight(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x + i][y - i] = b;
    }
}

function reverceRightDown(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x + i][y + i] = b;
    }
}

function reverceDownLeft(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x - i][y + i] = b;
    }
}

function reverceLeftUp(x, y, b, n) {
    for (let i = 1; i < n; i++) {
        ban[x - i][y - i] = b;
    }
}
