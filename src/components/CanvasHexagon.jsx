import React, {useEffect, useRef} from 'react';

const HEXAGON_ANGLE = 0.523598776; //30 градусов в радианах
const SIDE_LENGTH = 50; //длина стороны, пискелов
const BOARD_WIDTH = 8; //ширина "доски" по вертикали
const BOARD_HEIGHT = 8; //высота "доски" по вертикали
const hexHeight = Math.sin(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRadius = Math.cos(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRectangleHeight = SIDE_LENGTH + 2 * hexHeight;
const hexRectangleWidth = 2 * hexRadius;

const CanvasHexagon = () => {
    const hexagonCanvas = useRef();

    // useEffect(() => {
    //     var canvas = canvas2.current.getContext('2d'),
    //         side = 0,
    //         size = 100,
    //         x = 200,
    //         y = 200;

    //     canvas.beginPath();
    //     canvas.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    //     for (side; side < 7; side++) {
    //         canvas.lineTo(
    //             x + size * Math.cos((side * 2 * Math.PI) / 6),
    //             y + size * Math.sin((side * 2 * Math.PI) / 6)
    //         );
    //     }
    //     canvas.fillStyle = '#333333';
    //     canvas.fill();
    //     canvas.lineWidth = '10';
    //     canvas.strokeStyle = 'red';
    //     canvas.stroke();
    // }, []);

    useEffect(() => {
        const canvas = hexagonCanvas.current.getContext('2d');
        const L = 3,
            M = 5,
            N = 7;

        for (let i = 0; i < BOARD_WIDTH; i++) {
            for (let j = 0; j < BOARD_HEIGHT; j++) {
                let x =
                    i * hexRectangleWidth +
                    (j % 2) * hexRadius +
                    hexRectangleWidth;
                let y = j * (SIDE_LENGTH + hexHeight);

                drawHexagon(canvas, x, y);
            }
        }
    }, []);

    const drawHexagon = (canvas, x, y) => {
        canvas.beginPath();
        canvas.moveTo(x + hexRadius, y);
        canvas.lineTo(x + hexRectangleWidth, y + hexHeight);
        canvas.lineTo(x + hexRectangleWidth, y + hexHeight + SIDE_LENGTH);
        canvas.lineTo(x + hexRadius, y + hexRectangleHeight);
        canvas.lineTo(x, y + SIDE_LENGTH + hexHeight);
        canvas.lineTo(x, y + hexHeight);
        canvas.closePath();
        canvas.stroke();
    };

    return (
        <canvas
            ref={hexagonCanvas}
            className="canvas"
            width={400}
            height={400}
        />
    );
};

export default CanvasHexagon;
