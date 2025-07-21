import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { animateSlideChange } from './animations/slideAnimation';
import { initCircleWidget } from './animations/circleWidget';

export function initTimeEventsWidget() {
    const widgetRootNode = document.querySelector(
        '.time-events-widget'
    );
    if (!widgetRootNode) {
        console.warn('Блок time-events-widget не найден на странице');
        return;
    }

    const circleNode = widgetRootNode.querySelector<HTMLElement>(
        '.time-events-widget__circle'
    );
    const swiperContainerNode =
        widgetRootNode.querySelector<HTMLElement>(
            '.time-events-widget__carousel.swiper'
        );
    const prevBtnNode = widgetRootNode.querySelector<HTMLElement>(
        '.time-events-widget__segments-carousel-button_prev'
    );
    const nextBtnNode = widgetRootNode.querySelector<HTMLElement>(
        '.time-events-widget__segments-carousel-button_next'
    );
    const paginationNode = widgetRootNode.querySelector<HTMLElement>(
        '.time-events-widget__pagination'
    );

    if (
        !circleNode ||
        !swiperContainerNode ||
        !prevBtnNode ||
        !nextBtnNode ||
        !paginationNode
    ) {
        console.warn('Не все необходимые элементы найдены');
        return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const duration =
        parseFloat(
            rootStyles.getPropertyValue('--animation-duration')
        ) || 0;

    const swiper = new Swiper(swiperContainerNode, {
        modules: [Navigation, Pagination],
        loop: false,
        slidesPerView: 1,
        pagination: {
            el: paginationNode,
            type: 'fraction',
            formatFractionCurrent: (number) => `0${number}`,
            formatFractionTotal: (number) => `0${number}`,
        },
    });

    let currentIndex = swiper.realIndex;

    prevBtnNode.addEventListener('click', () => {
        if (currentIndex > 0) {
            animateToIndex(currentIndex - 1);
        }
    });
    nextBtnNode.addEventListener('click', () => {
        if (currentIndex < swiper.slides.length - 1) {
            animateToIndex(currentIndex + 1);
        }
    });

    const currentSlideNumberNode = paginationNode.querySelector(
        '.swiper-pagination-current'
    );
    const slideThemes = Array.from(swiper.slides)
        .map((slide) => slide.getAttribute('data-theme') || '')
        .filter((theme) => theme !== '');

    const circleWidget = initCircleWidget({
        circle: circleNode,
        themes: slideThemes,
        duration,
        onClick: (index) => animateToIndex(index),
    });

    let isAnimating = false;

    function animateToIndex(targetIndex: number) {
        if (targetIndex === currentIndex || isAnimating) return;

        isAnimating = true;
        animateSlideChange(swiper, targetIndex, duration);
        currentSlideNumberNode.textContent = `0${targetIndex + 1}`;
        circleWidget.setActiveIndex(targetIndex);

        swiper.once('slideChangeTransitionEnd', () => {
            currentIndex = targetIndex;
            isAnimating = false;
        });

        setTimeout(() => {
            isAnimating = false;
        }, duration * 1000);
    }

    swiper.on('slideChange', () => {
        currentIndex = swiper.realIndex;
        circleWidget.setActiveIndex(currentIndex);
    });

    circleWidget.setActiveIndex(currentIndex);
    swiper.slideTo(currentIndex, 0, false);
}
