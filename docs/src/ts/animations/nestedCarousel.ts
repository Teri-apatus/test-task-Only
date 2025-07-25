import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

export function initNestedCarousel(
    activeSlide: HTMLElement,
    prevSwiper: Swiper | null
): Swiper {
    if (prevSwiper) {
        prevSwiper.destroy(true, true);
        prevSwiper = null;
    }

    const nestedCarousel = activeSlide.querySelector<HTMLElement>(
        '.carousel-widget__nested-carousel.swiper'
    );
    const prevBtn = activeSlide.querySelector<HTMLElement>(
        '.carousel-widget__nested-carousel-navigation-button--prev'
    );
    const nextBtn = activeSlide.querySelector<HTMLElement>(
        '.carousel-widget__nested-carousel-navigation-button--next'
    );
    const computedStyle = getComputedStyle(prevBtn);
    const margin = parseFloat(computedStyle.marginLeft) * 4;
    console.log(margin);
    const swiper = new Swiper(nestedCarousel, {
        modules: [Navigation],
        slidesPerView: 'auto',
        loop: false,
        navigation: {
            prevEl: prevBtn,
            nextEl: nextBtn,
        },

        breakpoints: {
            0: {
                spaceBetween: 25,
                slidesOffsetBefore: margin,
                slidesOffsetAfter: 55,
            },
            768: {
                spaceBetween: 80,
            },
        },
        watchOverflow: true,
    });

    return swiper;
}
