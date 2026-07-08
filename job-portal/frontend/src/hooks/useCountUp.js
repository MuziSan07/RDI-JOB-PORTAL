import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 → target once the element scrolls into view.
 * Returns [value, ref]. Attach ref to the element you want to observe.
 */
export const useCountUp = (target = 0, duration = 1400) => {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const run = () => {
            if (started.current) return;
            started.current = true;
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
                setValue(Math.round(eased * target));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && run()),
            { threshold: 0.4 }
        );
        obs.observe(node);
        return () => obs.disconnect();
    }, [target, duration]);

    return [value, ref];
};

export default useCountUp;
