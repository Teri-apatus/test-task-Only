import Swiper from 'swiper';
import gsap from 'gsap';

export function animateSlideChange(
    swiper: Swiper,
    targetIndex: number,
    duration: number
) {
    if (swiper.activeIndex === targetIndex) return;

    const currentSlide: HTMLElement =
        swiper.slides[swiper.activeIndex];
    const nextSlide: HTMLElement = swiper.slides[targetIndex];

    gsap.to(currentSlide, {
        opacity: 0,
        duration: duration / 2,
        ease: 'power1.out',
        onComplete() {
            currentSlide.style.pointerEvents = 'none';

            swiper.slideTo(targetIndex, 0, false);

            nextSlide.style.pointerEvents = 'auto';
            gsap.set(nextSlide, { opacity: 0 });
            gsap.to(nextSlide, {
                opacity: 1,
                duration: duration / 2,
                ease: 'power1.out',
            });
        },
    });
}
