// snow
const NUMBER_OF_SNOWFLAKES = 100;
const SNOWFLAKE_SPEED = 2;
const SNOWFLAKE_SIZE = 3;
const SNOWFLAKE_COLOR = '#ddd';
const snowflakes = [];

// rain
const NUMBER_OF_DROPS = 200;
const DROP_SPEED = 10;
const DROP_SIZE = 15;
const DROP_COLOR = '#cde4fd';
const drops = [];

// stars
const NUMBER_OF_STARS = 300;
const TWINKLE_SPEED = 0.01;
const STAR_SIZE = 2;
const STAR_COLOR = '#fff';
const stars = [];

// sun
const SUN_SIZE = 50;
const RAY_SIZE = 60;
const SUN_COLOR ="rgb(255, 204, 51)";
const RAY_ALPHA = 0.4;
const SUN_TWINKLE_SPEED = 0.0025;
let sun = null;

const canvas = document.createElement('canvas');
const body = document.querySelector('body');

const ctx = canvas.getContext('2d');

let animationFrameId;
let isAnimating = false;

const createSnowflake = () => {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.floor(Math.random() * SNOWFLAKE_SIZE) + 1,
        color: SNOWFLAKE_COLOR,
        speed: Math.random() * SNOWFLAKE_SPEED + 1,
        sway: Math.random() - 0.5,
    };
};

const createDrop = () => {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height, 
        size: DROP_SIZE,
        color: DROP_COLOR,
        speed: Math.random() * DROP_SPEED + DROP_SPEED * 0.5,
        sway: 2
    }
}

const createStar = () => {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: STAR_SIZE,
        alpha: Math.random(),
        speed: Math.random() * TWINKLE_SPEED,
    }
}

const createSun = () => {
    return {
        x: Math.random() * canvas.width * 0.01 + canvas.width * 0.05,
        y: Math.random() * canvas.height * 0.01 + canvas.height * 0.15,
        size: SUN_SIZE,
        color: SUN_COLOR,
        raySize: RAY_SIZE,
        rayAlpha: RAY_ALPHA,
        speed: SUN_TWINKLE_SPEED,
    }
}

const drawSnowflake = (snowflake) => {
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fillStyle = snowflake.color;
    ctx.fill();
    ctx.closePath();
};

const drawDrop = (drop) => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.sway, drop.y + drop.size);
    ctx.strokeStyle = drop.color;
    ctx.stroke();
    ctx.closePath();
}

const drawStar = (star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
    ctx.closePath();
}

const drawSun = (sun) => {
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.size, 0, Math.PI * 2);
    ctx.fillStyle = SUN_COLOR;
    ctx.fill();
    ctx.arc(sun.x, sun.y, sun.raySize, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(255, 204, 51, ${sun.rayAlpha})`;
    ctx.fill();
    ctx.closePath();
}

const updateSnowflake = snowflake => {
    snowflake.y += snowflake.speed;
    snowflake.x += snowflake.sway;
    if (snowflake.y > canvas.height) {
        Object.assign(snowflake, createSnowflake());
    }
};

const updateDrop = drop => {
    drop.y += drop.speed;
    drop.x += drop.sway;
    if (drop.y > canvas.height) {
        Object.assign(drop, createDrop());
    }
};

const updateStar = star => {
    star.alpha += star.speed;
    if (star.alpha > 0.6 || star.alpha < 0.3) {
        star.speed *= -1;
    }
}

const updateSun = sun => {
    sun.rayAlpha += sun.speed;
    if (sun.rayAlpha > 0.5 || sun.rayAlpha < 0.3) {
        sun.speed *= -1;
    }
}

const animateSnow = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach(snowflake => {
        updateSnowflake(snowflake);
        drawSnowflake(snowflake);
    });


    animationFrameId = requestAnimationFrame(animateSnow);
};

const animateDrops = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach(drop => {
        updateDrop(drop);
        drawDrop(drop);
    });

    animationFrameId = requestAnimationFrame(animateDrops);
};

const animateStars = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        updateStar(star);
        drawStar(star);
    });

    animationFrameId = requestAnimationFrame(animateStars);
}

const animateSun = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateSun(sun);
    drawSun(sun);

    animationFrameId = requestAnimationFrame(animateSun);
}

const setUpCanvas = () => {
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = -100;
    body.appendChild(canvas);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    window.addEventListener('scroll', () => {
        canvas.style.top = `${window.scroll.y}px`;
    });
};

const snowflakesArrayPush = () => {
    for (let i = 0; i < NUMBER_OF_SNOWFLAKES; i++) {
        snowflakes.push(createSnowflake());
    }
};

const dropsArrayPush = () => {
    for (let i = 0; i < NUMBER_OF_DROPS; i++) {
        drops.push(createDrop());
    }
};

const starsArrayPush = () => {
    for (let i = 0; i < NUMBER_OF_STARS; i++) {
        stars.push(createStar());
    }
}

export const snowAnimation = () => {
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
    }
    isAnimating = true;
    snowflakes.length = 0;
    setUpCanvas();
    snowflakesArrayPush();
    animateSnow();
};

export const rainAnimation = () => {
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
    }
    isAnimating = true;
    drops.length = 0;
    setUpCanvas();
    dropsArrayPush();
    animateDrops();
}

export const starAnimation = () => {
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
    }
    isAnimating = true;
    stars.length = 0;
    setUpCanvas();
    starsArrayPush();
    animateStars();
}

export const sunAnimation = () => {
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
    }
    isAnimating = true;
    setUpCanvas();
    sun = createSun();
    animateSun();
}

export const clearSnowflakes = () => {
    isAnimating = false;
    cancelAnimationFrame(animationFrameId);
    snowflakes.length = 0;
    drops.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};
