const NUMBER_OF_SNOWFLAKES = 100;
const SNOWFLAKE_SPEED = 2;
const SNOWFLAKE_SIZE = 3;
const SNOWFLAKE_COLOR = '#ddd';
const snowflakes = [];

const canvas = document.createElement('canvas');
const body = document.querySelector('body');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = -100;
body.appendChild(canvas);

const ctx = canvas.getContext('2d');

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

const drawSnowflake = (snowflake) => {
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fillStyle = snowflake.color;
    ctx.fill();
    ctx.closePath();
};

const updateSnowflake = snowflake => {
    snowflake.y += snowflake.speed;
    snowflake.x += snowflake.sway;
    if (snowflake.y > canvas.height) {
        Object.assign(snowflake, createSnowflake());
    }
};

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach(snowflake => {
        updateSnowflake(snowflake);
        drawSnowflake(snowflake);
    });

    requestAnimationFrame(animate);
};

export const snowAnimation = () => {
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    window.addEventListener('scroll', () => {
        canvas.style.top = `${window.scroll.y}px`;
    });
    snowflakesArrayPush();
    animate();

}

const snowflakesArrayPush = () => {
    for (let i = 0; i < NUMBER_OF_SNOWFLAKES; i++) {
        snowflakes.push(createSnowflake());
    }
}