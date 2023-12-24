const m = document.getElementById("sand").getContext("2d");

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
 * ランダムに壁を生成する
 *
 * @param {number} 数
 * @param {string} 色
 */
create_wall = (number, color) => {
    group = [];
    for (let i = 0; i < number; i++) {
        group.push(particle(random(), random(), color));
        particles.push(group[i]);
    }
    return group;
}

/**
 * パーティクルを生成する
 *
 * @param {number} 数
 * @param {string} 色
 */
create = (number, color) => {
    group = [];
    for (let i = 0; i < number; i++) {
        group.push(particle(random(), random(), color));
        particles.push(group[i]);
    }
    return group;
}

/**
 * 砂を動かす
 *
 * 砂は重力に従って落下する、下に砂または壁がある場合は左右または上にランダムに移動する
 *
 * @param {array} 砂
 * @param {number} 重力定数
 */
sand_move = (sands, g) => {
    for (let i = 0; i < sands.length; i++) {
        a = sands[i];
        a.vy += g;
        a.y += a.vy;

        // 画面外に出ないようにする
        if (a.x <= 0 || a.x >= 500) {
            a.vx *= -1;
        }
        if (a.y <= 0 || a.y >= 500) {
            a.vy *= -1;
        }
    }
}

const SANDS_NUMBER = 310;
let purple = create(SANDS_NUMBER, "purple");
let red    = create(SANDS_NUMBER, "red");
let yellow = create(SANDS_NUMBER, "yellow");
let green  = create(SANDS_NUMBER, "green");
let blue   = create(SANDS_NUMBER, "blue");
let cyan   = create(SANDS_NUMBER, "cyan");
let white  = create(SANDS_NUMBER, "white");

/**
 * パーティクルを更新する
 */
update = () => {
    sand_move(white, 0.5);
    sand_move(yellow, 0.4);
    sand_move(cyan, 0.3);
    sand_move(red, 0.2);
    sand_move(green, 0.1);
    sand_move(blue, 0.6);
    sand_move(purple, 1);

    m.clearRect(0, 0, 500, 500);
    draw(0, 0, "black", 500);
    for (let i = 0; i < particles.length; i++) {
        draw(particles[i].x, particles[i].y, particles[i].color, 3);
    }
    requestAnimationFrame(update);
}

update();
