import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    const durationStr = rootStyles.getPropertyValue(
        '--animation-duration'
    );
    const duration = parseFloat(durationStr);

    const swiper = new Swiper(swiperContainerNode, {
        modules: [Navigation, Pagination],
        loop: false,
        slidesPerView: 1,
        navigation: {
            nextEl: nextBtnNode,
            prevEl: prevBtnNode,
        },
        pagination: {
            el: paginationNode,
            type: 'fraction',
            formatFractionCurrent: (number) => `0${number}`,
            formatFractionTotal: (number) => `0${number}`,
        },
    });

    const slideThemes = Array.from(swiper.slides)
        .map((slide) => slide.getAttribute('data-theme') || '')
        .filter((theme) => theme !== '');

    const circleWidget = initCircleWidget({
        circle: circleNode,
        themes: slideThemes,
        duration: duration,
        onClick: (index) => swiper.slideTo(index),
    });

    swiper.on('slideChange', () => {
        circleWidget.setActiveIndex(swiper.realIndex);
    });

    circleWidget.setActiveIndex(swiper.realIndex);
}
