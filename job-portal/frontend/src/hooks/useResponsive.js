import { useState, useEffect } from 'react';

// Shared breakpoints (px). Mobile-first thinking: < these widths.
export const BREAKPOINTS = {
    mobile: 640,   // phones
    tablet: 1024,  // tablets / small laptops
};

/**
 * Returns the current window width and re-renders the component on resize.
 * SSR-safe default of 1200 (desktop) so first paint is sensible.
 */
export const useWindowWidth = () => {
    const [width, setWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );

    useEffect(() => {
        let raf = null;
        const onResize = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => setWidth(window.innerWidth));
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return width;
};

/**
 * Convenience hook returning responsive flags.
 *   isMobile  -> width <= 640
 *   isTablet  -> 640 < width <= 1024
 *   isDesktop -> width > 1024
 */
export const useResponsive = () => {
    const width = useWindowWidth();
    return {
        width,
        isMobile: width <= BREAKPOINTS.mobile,
        isTablet: width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet,
        isDesktop: width > BREAKPOINTS.tablet,
        // true for anything tablet-and-down (handy for sidebar collapse)
        isCompact: width <= BREAKPOINTS.tablet,
    };
};

export default useResponsive;
