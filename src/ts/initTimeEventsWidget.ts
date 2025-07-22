import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { animateSlideChange } from './animations/slideAnimation';
import { initCircleWidget } from './animations/circleWidget';
import { animateYearCounter } from './animations/yearAnimation';
import { initNestedCarousel } from './animations/nestedCarousel';

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
    const yearStartNode = widgetRootNode.querySelector<HTMLElement>(
        '.time-events-widget__year-start'
    );
    const yearEndNode = widgetRootNode.querySelector<HTMLElement>(
        '.time-events-widget__year-end'
    );

    if (
        !circleNode ||
        !swiperContainerNode ||
        !prevBtnNode ||
        !nextBtnNode ||
        !paginationNode ||
        !yearStartNode ||
        !yearEndNode
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
        allowTouchMove: false,
        pagination: {
            el: paginationNode,
            type: 'fraction',
            formatFractionCurrent: (number) => `0${number}`,
            formatFractionTotal: (number) => `0${number}`,
        },
    });

    let currentIndex = swiper.realIndex;
    let activeSlide = swiper.slides[currentIndex];
    let currentNestedSwiper: Swiper | null = null;

    currentNestedSwiper = initNestedCarousel(
        activeSlide,
        currentNestedSwiper
    );
    updateNavButtons();

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
    const eventsListsNode = Array.from(
        widgetRootNode.querySelectorAll<HTMLElement>(
            '.time-events-widget__events-list'
        )
    );
    const yearIntervals = eventsListsNode.map((eventsList) => {
        const titles = Array.from(
            eventsList.querySelectorAll<HTMLElement>(
                '.time-events-widget__event-title'
            )
        );
        const start = parseFloat(titles[0].textContent);
        const end = parseFloat(titles[titles.length - 1].textContent);
        return { start: start, end: end };
    });

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
        const fromYears = yearIntervals[currentIndex];
        const toYears = yearIntervals[targetIndex];

        isAnimating = true;
        animateSlideChange(swiper, targetIndex, duration);
        currentSlideNumberNode.textContent = `0${targetIndex + 1}`;
        circleWidget.setActiveIndex(targetIndex);
        animateYearCounter({
            element: yearStartNode,
            from: fromYears.start,
            to: toYears.start,
            duration,
        });
        animateYearCounter({
            element: yearEndNode,
            from: fromYears.end,
            to: toYears.end,
            duration,
        });

        swiper.once('slideChangeTransitionEnd', () => {
            currentIndex = targetIndex;
            isAnimating = false;
        });

        setTimeout(() => {
            isAnimating = false;
        }, duration * 1000);
    }

    function updateNavButtons() {
        if (currentIndex === 0) {
            prevBtnNode.classList.add('swiper-button-disabled');
        } else {
            prevBtnNode.classList.remove('swiper-button-disabled');
        }

        if (currentIndex === swiper.slides.length - 1) {
            nextBtnNode.classList.add('swiper-button-disabled');
        } else {
            nextBtnNode.classList.remove('swiper-button-disabled');
        }
    }

    swiper.on('slideChange', () => {
        currentIndex = swiper.realIndex;
        activeSlide = swiper.slides[currentIndex];
        circleWidget.setActiveIndex(currentIndex);
        currentNestedSwiper = initNestedCarousel(
            activeSlide,
            currentNestedSwiper
        );
        updateNavButtons();
    });

    circleWidget.setActiveIndex(currentIndex);
    swiper.slideTo(currentIndex, 0, false);
    yearStartNode.textContent = String(
        yearIntervals[currentIndex].start
    );
    yearEndNode.textContent = String(yearIntervals[currentIndex].end);
}
