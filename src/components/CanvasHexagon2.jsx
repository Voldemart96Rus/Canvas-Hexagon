import React, {useRef, useEffect} from 'react';

const CanvasHexagon = ({settings}) => {
    const hexagonCanvas = useRef();

    useEffect(() => {
        const canvas = hexagonCanvas.current;
        canvas.style.left = settings.x + 'px';
        canvas.style.top = settings.y + 'px';
        canvas.style.setProperty('--background', settings.color);
    }, [settings, settings.color]);

    return (
        <div ref={hexagonCanvas} id={settings.id} className="hexagon">
            {settings.value ? settings.value : ''}
        </div>
    );
};

export default CanvasHexagon;
