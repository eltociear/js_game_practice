m = document.getElementById("sand").getContext("2d");

draw = (x, y, c, s) => {
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

particles = [];
particle = (x, y, c) => {
    return {
        "x": x,
        "y": y,
        "vx": 0,
        "vy": 0,
        "color": c,
    }
}

/**
 * ランダムな数を生成する
 *
 * @return {number} ランダムな数
 */
random = () => {
    return Math.random() * 400 + 50;
}

/**
 * パーティクルを生成する
 *
 * @param {number} 数
 */
create = (number) => {
    group = [];
    for (let i = 0; i < number; i++) {
        let color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
        group.push(particle(random(), random(), color));
        particles.push(group[i]);
    }
    return group;
}

/**
 * パーティクルの相互作用を定義する
 *
 * @param {array} パーティクル1
 * @param {array} パーティクル2
 * @param {number} 重力定数 マイナスの場合引き合う
 */
rule = (particles1, particles2, g) => {
    for (let i = 0; i < particles1.length; i++) {
        fx = 0;
        fy = 0;
        for (let j = 0; j < particles2.length; j++) {
            a = particles1[i];
            b = particles2[j];

            dx = a.x - b.x; // パーティクル間の距離
            dy = a.y - b.y; // パーティクル間の距離
            d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0 && d < 80) {
                F = g * 1 / d; // パーティクル間の力
                fx += (F * dx); // パーティクルに働く力
                fy += (F * dy); // パーティクルに働く力
            }
        }
        a.vx = (a.vx + fx) * 0.5;
        a.vy = (a.vy + fy) * 0.5;
        a.x += a.vx;
        a.y += a.vy;
        // 色をランダムで変更
        a.color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";

        // 画面外に出ないようにする
        if (a.x <= 0 || a.x >= 500) {
            a.vx *= -1;
        }
        if (a.y <= 0 || a.y >= 500) {
            a.vy *= -1;
        }
    }
}

const PARTICLE_NUMBER = 150;
let purple = create(PARTICLE_NUMBER);
let red    = create(PARTICLE_NUMBER);
let yellow = create(PARTICLE_NUMBER);
let green  = create(PARTICLE_NUMBER);
let blue   = create(PARTICLE_NUMBER);
let cyan   = create(PARTICLE_NUMBER);
let white  = create(PARTICLE_NUMBER);

/**
 * パーティクルを更新する
 */
update = () => {
    rule(purple, purple, 0.1);
    rule(purple, white, 0.1);
    rule(red, red, 0.1);
    rule(red, green, 0.1);
    rule(yellow, yellow, 0.1);
    rule(yellow, green, 0.1);
    rule(green, green, 0.1);
    rule(green, blue, 0.1);
    rule(blue, blue, 0.1);
    rule(blue, cyan, 0.1);
    rule(cyan, cyan, 0.1);
    rule(cyan, white, 0.1);
    rule(white, white, 0.1);

    m.clearRect(0, 0, 500, 500);
    draw(0, 0, "black", 500);
    for (let i = 0; i < particles.length; i++) {
        draw(particles[i].x, particles[i].y, particles[i].color, 7);
    }
    requestAnimationFrame(update);
}

update();
