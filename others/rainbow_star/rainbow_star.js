const m = document.getElementById("rainbow_star").getContext("2d");

onload = function () {
    // ゲームループの設定 60FPS
    setInterval("gameloop()", 100);
};

function gameloop() {
    update();
}

draw = (x, y, c, s) => {
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

update = () => {
    m.clearRect(0, 0, 500, 500);
    draw(0, 0, "black", 500);
    
    // 画面の中心に星を描く
    // let color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";

    // 色が虹色で変化する星を描く
    let colorR = 0;
    let colorG = 0;
    let colorB = 0;
    // 無限ループ
    for (true; true; true) {
        if (colorR == 255 && colorG == 0 && colorB == 0) {
            break;
        }
        draw(250, 250, "rgb(" + colorR + "," + colorG + "," + colorB + ")", 10);
        colorR += 1;
        colorG += 1;
        colorB += 1;
    }

    // let color = "rgb(" + colorR + "," + colorG + "," + colorB + ")";

    draw(250, 250, color, 10);

    requestAnimationFrame(update);
}
