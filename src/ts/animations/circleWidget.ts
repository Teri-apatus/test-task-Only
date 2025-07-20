import gsap from 'gsap';

export function initCircleWidget({
    circle,
    themes,
    duration,
    onClick,
}: {
    circle: HTMLElement;
    themes: string[];
    duration: number;
    onClick: (index: number) => void;
}): {
    setActiveIndex: (targetIndex: number) => void;
} {
    circle.innerHTML = '';

    const buttons: HTMLElement[] = themes.map((theme, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('time-events-widget__circle-button');
        btn.innerHTML = `<p><span class="time-events-widget__circle-button-number">${
            i + 1
        }</span>
        <span class="time-events-widget__circle-button-label">${theme}</span></p>`;
        circle.appendChild(btn);
        return btn;
    });

    const buttonsAmount = buttons.length;
    const stepAngleDeg = 360 / buttonsAmount;
    const vertexShiftAngle = stepAngleDeg / 2;

    function positionButtons() {
        const computedStyle = getComputedStyle(circle);
        const diameter = parseFloat(
            computedStyle.getPropertyValue('--circle-diameter')
        );
        const radius = diameter / 2;
        const centerX = circle.clientWidth / 2;
        const centerY = circle.clientHeight / 2;

        buttons.forEach((btn, i) => {
            const angleRad =
                ((stepAngleDeg * i - 90 + vertexShiftAngle) *
                    Math.PI) /
                180;

            const x = centerX + radius * Math.cos(angleRad);
            const y = centerY + radius * Math.sin(angleRad);

            btn.style.left = `${x}px`;
            btn.style.top = `${y}px`;
        });
    }

    let currentTimeline: gsap.core.Timeline | null = null;
    let currentIndex = 0;

    function animateToIndex(targetIndex: number) {
        if (currentTimeline) {
            currentTimeline.kill();
            currentTimeline = null;
        }
        currentIndex = targetIndex;

        const rotation = -stepAngleDeg * targetIndex;
        console.log(stepAngleDeg);

        currentTimeline = gsap.timeline({
            defaults: {
                duration,
                ease: 'power1.out',
            },
        });

        currentTimeline.to(
            circle,
            {
                rotation,
                onUpdate() {
                    const currentRotation = gsap.getProperty(
                        circle,
                        'rotation'
                    ) as number;
                    buttons.forEach((btn) => {
                        const text = btn.querySelector('p');
                        if (text) {
                            gsap.set(text, {
                                rotation: -currentRotation,
                            });
                        }
                    });
                },
            },
            0
        );

        buttons.forEach((btn, i) => {
            btn.classList.toggle(
                'time-events-widget__circle-button--active',
                i === targetIndex
            );
        });
    }

    buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            onClick(i);
            animateToIndex(i);
        });
    });

    positionButtons();
    animateToIndex(0);

    return {
        setActiveIndex: animateToIndex,
    };
}
