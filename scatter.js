const NUM_IMAGES = 21; // number of images: cards/0.jpg ... cards/5.jpg

const easing = t => 1 - (1 - t) * (1 - t);

const images = [];

// Center start point
const startX = window.innerWidth / 2 - 50;
const startY = window.innerHeight / 16

// Helper to wait for image load
function createImage(src, callback) {
    const img = new Image();
    img.src = src;
    img.className = 'moving-img';
    img.onload = () => callback(img);
    document.body.appendChild(img);
}

let loadedCount = 0;

for (let i = 0; i < NUM_IMAGES; i++) {
    createImage(`cards/${i}.jpg`, (img) => {
        const imgWidth = img.offsetWidth;
        const imgHeight = img.offsetHeight;

        img.style.transform = `translate(${startX}px, ${startY}px) rotate(0deg)`;

        const state = {
            el: img,
            startX: startX + (Math.random() - 0.5) * 10, 
            startY: startY + (Math.random() - 0.5) * 10,
            startAngle: (Math.random() - 0.5) * 10,
            targetX: Math.random() * (window.innerWidth - imgWidth),
            targetY: Math.random() * (window.innerHeight - imgHeight),
            targetAngle: (Math.random() - 0.5) * 360 - 180,
            focused: false
        };

        img.addEventListener('click', () => {
            state.focused = !state.focused;
            if (state.focused) {
                img.classList.add('focused');
                const centerX = window.innerWidth / 2 - 150;
                const centerY = window.innerHeight / 2 - 150;
                img.style.transform = `translate(${centerX}px, ${centerY}px) rotate(0deg)`;
            } else {
                img.classList.remove('focused');
                const x = state.targetX;
                const y = state.targetY;
                const angle = state.targetAngle;
                img.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            }
        });

        images.push(state);
        loadedCount++;

        // Start animation once all images are loaded
        if (loadedCount === NUM_IMAGES) {
            startAnimation();
        }
    });
}

const DURATION = 1000; // scatter duration in ms

function startAnimation() {
    const startTime = performance.now();

    function animate(time) {
        const t = Math.min((time - startTime) / DURATION, 1); // 0 → 1
        const eased = easing(t); // linear
        console.log("Time: ", t, eased)

        for (const obj of images) {
            if (!obj.focused) {
                const x = obj.startX + (obj.targetX - obj.startX) * eased;
                const y = obj.startY + (obj.targetY - obj.startY) * eased;
                const angle = obj.startAngle + (obj.targetAngle - obj.startAngle) * eased;
                obj.el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            }
        }

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

