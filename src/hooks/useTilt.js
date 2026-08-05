import { useRef, useEffect } from 'react';

export function useTilt(options = {}) {
  const ref = useRef(null);
  const { max = 15, speed = 400, scale = 1.05, glare = true, maxGlare = 0.5 } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;

    const handleMouseMove = (e) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const multiplier = 2;
      const rotateX = ((y / rect.height) - 0.5) * -max * multiplier;
      const rotateY = ((x / rect.width) - 0.5) * max * multiplier;

      node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      
      if (glare) {
        let glareEl = node.querySelector('.tilt-glare');
        if (!glareEl) {
          glareEl = document.createElement('div');
          glareEl.className = 'tilt-glare';
          node.appendChild(glareEl);
          node.style.position = 'relative';
          node.style.overflow = 'hidden';
        }
        const percentageX = (x / rect.width) * 100;
        const percentageY = (y / rect.height) * 100;
        glareEl.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,${maxGlare}), transparent 50%)`;
        glareEl.style.opacity = 1;
      }
    };

    const handleMouseLeave = () => {
      node.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (glare) {
        const glareEl = node.querySelector('.tilt-glare');
        if (glareEl) {
          glareEl.style.opacity = 0;
        }
      }
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [max, speed, scale, glare, maxGlare]);

  return ref;
}
