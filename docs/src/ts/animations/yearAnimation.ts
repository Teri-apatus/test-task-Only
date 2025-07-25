import gsap from 'gsap';

export function animateYearCounter({
    element,
    from,
    to,
    duration,
}: {
    element: HTMLElement;
    from: number;
    to: number;
    duration: number;
}) {
    const yearValue = { value: from };

    gsap.to(yearValue, {
        value: to,
        duration,
        ease: 'power1.out',
        onUpdate() {
            element.textContent = String(Math.round(yearValue.value));
        },
    });
}
