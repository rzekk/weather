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

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach(snowflake => {
        updateSnowflake(snowflake);
        drawSnowflake(snowflake);
    });


    animationFrameId = requestAnimationFrame(animate);
};

const animateDrops = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach(drop => {
        updateDrop(drop);
        drawDrop(drop);
    });

    animationFrameId = requestAnimationFrame(animateDrops);
};

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

export const snowAnimation = () => {
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
    }
    isAnimating = true;
    snowflakes.length = 0;
    setUpCanvas();
    snowflakesArrayPush();
    animate();
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

export const clearSnowflakes = () => {
    isAnimating = false;
    cancelAnimationFrame(animationFrameId);
    snowflakes.length = 0;
    drops.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};
