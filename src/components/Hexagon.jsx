import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

const Hexagon = ({settings}) => {
    const hexagon = useRef();

    useEffect(() => {
        const currentHexagon = hexagon.current;
        currentHexagon.style.left = settings.x + 'px';
        currentHexagon.style.top = settings.y + 'px';
        currentHexagon.style.setProperty('--background', settings.color);
    }, [settings, settings.color]);

    return (
        <div ref={hexagon} id={settings.id} className="hexagon">
            {settings.value ? settings.value : ''}
        </div>
    );
};

Hexagon.propTypes = {
    settings: PropTypes.object.isRequired, //todo дописать поля у settings
};

export default Hexagon;
