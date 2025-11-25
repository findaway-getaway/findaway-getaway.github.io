const PASSWORD = "1"; // The password to unlock

// Cache DOM references
const overlay = document.getElementById('passwordOverlay');
const input = document.getElementById('passwordInput');
const button = document.getElementById('passwordButton');
const errorMsg = document.getElementById('errorMsg');

// Attach password events only once
if (button) {
    button.addEventListener('click', () => {
        if (input.value === PASSWORD) {
            overlay.style.display = 'none';
            scatterInit(); // start scatter once password is correct
        } else {
            errorMsg.style.visibility = 'visible';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            button.click();
        }
    });
}

// Public init function so it can be called when Page 2 is shown
function scatterInit() {
    // Avoid double-init if already scattered
    if (document.querySelector('.moving-img')) return;

    const NUM_CARDS = 21;
    const easing = t => 1 - (1 - t) * (1 - t);
    const images = [];
    const tmpImages = [];

    // Center start point
    const startX = window.innerWidth / 2 - 50;
    const startY = window.innerHeight / 16;

    // Helper to wait for image load
    function createImage(src, callback) {
        const img = new Image();
        img.src = src;
        img.className = 'moving-img';
        img.onload = () => callback(img);
    }

    let loadedCount = 0;

    for (let i = 0; i < NUM_CARDS; i++) {
        createImage(`cards/${i}.jpg`, (img) => {
            const imgWidth = img.width || 100;
            const imgHeight = img.height || 150;

            img.style.transform = `translate(${startX}px, ${startY}px) rotate(0deg)`;
            img.style.visibility = 'hidden';

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
                const currentFocused = images.find(obj => obj.focused);
                if (currentFocused && currentFocused !== state) {
                    currentFocused.focused = false;
                    currentFocused.el.classList.remove('focused');
                    const { targetX, targetY, targetAngle } = currentFocused;
                    currentFocused.el.style.transform =
                        `translate(${targetX}px, ${targetY}px) rotate(${targetAngle}deg)`;
                }

                // existing toggle logic
                state.focused = !state.focused;
                if (state.focused) {
                    img.classList.add('focused');
                    const centerX = window.innerWidth / 2 - 150;
                    const centerY = window.innerHeight / 2 - 150;
                    img.style.transform = `translate(${centerX}px, ${centerY}px) rotate(0deg)`;
                } else {
                    img.classList.remove('focused');
                    const { targetX, targetY, targetAngle } = state;
                    img.style.transform =
                        `translate(${targetX}px, ${targetY}px) rotate(${targetAngle}deg)`;
                }
            });

            tmpImages.push(state);
            loadedCount++;

            // Start animation once all images are loaded
            if (loadedCount === NUM_CARDS) {
                for (const obj of tmpImages) {
                    document.getElementById("page2").appendChild(obj.el);
                    obj.el.style.visibility = 'visible';
                    images.push(obj);
                }
                startAnimation(images);
            }
        });
    }

    const DURATION = 1000;

    function startAnimation(images) {
        console.log("Starting startAnimation");
        const startTime = performance.now();

        function animate(time) {
            const t = Math.min((time - startTime) / DURATION, 1);
            const eased = easing(t);

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
}

