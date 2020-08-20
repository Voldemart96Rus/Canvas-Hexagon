import React, {useRef, useEffect} from 'react';

const CanvasHexagon = ({settings}) => {
    const hexagonCanvas = useRef();
    useEffect(() => {
        const canvas = hexagonCanvas.current;
        canvas.style.left = settings.x + 'px';
        canvas.style.top = settings.y + 'px';
        canvas.style.setProperty('--background', settings.color);
    }, [settings]);

    return (
        <div ref={hexagonCanvas} className="hexagon" value={settings.id}>
            {settings.value ? settings.value : ''}
        </div>
    );
};

export default CanvasHexagon;
