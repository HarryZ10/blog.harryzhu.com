import React, { useEffect, useRef, useState } from 'react';
import '../styles/fadein.css';

export default function FadeIn(props) {
    const [isIntersecting, setIntersecting ] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([ entry ]) => {
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin: "-300px",
            }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();

    }, []);

    useEffect(() => {
        if (isIntersecting) {
            containerRef.current.querySelectorAll('div').forEach((element) => {
                element.classList.add('slide-in');
            });
        } else {
            // Remove slide in if not in view
            containerRef.current.querySelectorAll("div").forEach((element) => {
                element.classList.remove("slide-in");
            });
        }
    }, [isIntersecting]);

    return (
        <div ref={containerRef}>
            {props.children}
        </div>
    )
}