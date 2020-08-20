import React, {useEffect, useRef} from 'react';

const HEXAGON_ANGLE = 0.523598776; //30 градусов в радианах
const SIDE_LENGTH = 20; //длина стороны в пикселях
// const BOARD_WIDTH = 8; //ширина "доски" по вертикали
// const BOARD_HEIGHT = 8; //высота "доски" по вертикали
const hexHeight = Math.sin(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRadius = Math.cos(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRectangleHeight = SIDE_LENGTH + 2 * hexHeight;
const hexRectangleWidth = 2 * hexRadius; //34.6px

const CanvasHexagon = () => {
    const hexagonCanvas = useRef();

    useEffect(() => {
        const canvas = hexagonCanvas.current.getContext('2d');
        const drawBoard = (canvas) => {
            const L = 3,
                M = 5,
                N = 7;

            let count = N;

            let x = 0;
            let y = 0;

            for (let l = L; l > 0; l--) {
                x = l * hexRadius;
                y = (SIDE_LENGTH + hexHeight) * (L - l);
                for (let i = 0; i < count; i++) {
                    // console.info(x + hexRectangleWidth * i - hexRadius, y);
                    drawHexagon(
                        canvas,
                        x + hexRectangleWidth * i - hexRadius,
                        y
                    );
                }
                count++;
            }

            count = N + L - 1;

            for (let m = 1; m < M; m++) {
                x = m * hexRadius;
                y = (SIDE_LENGTH + hexHeight) * (L + m - 1);
                if (M - m < L) count--;
                for (let i = 0; i < count; i++) {
                    drawHexagon(canvas, x + hexRectangleWidth * i, y);
                }
            }
        };

        const drawHexagon = (canvas, x, y, fill = false) => {
            canvas.beginPath();
            const x1 = x + hexRadius;
            const y1 = y;
            canvas.moveTo(x + hexRadius, y);
            const x2 = x + hexRectangleWidth;
            const y2 = y + hexHeight;
            canvas.lineTo(x + hexRectangleWidth, y + hexHeight);
            const x3 = x + hexRectangleWidth;
            const y3 = y + hexHeight + SIDE_LENGTH;
            canvas.lineTo(x + hexRectangleWidth, y + hexHeight + SIDE_LENGTH);
            const x4 = x + hexRadius;
            const y4 = y + hexRectangleHeight;
            canvas.lineTo(x + hexRadius, y + hexRectangleHeight);
            const x5 = x;
            const y5 = y + SIDE_LENGTH + hexHeight;
            canvas.lineTo(x, y + SIDE_LENGTH + hexHeight);
            const x6 = x;
            const y6 = y + hexHeight;
            canvas.lineTo(x, y + hexHeight);
            // const l = {
            //     x1,
            //     y1,
            //     x2,
            //     y2,
            //     x3,
            //     y3,
            //     x4,
            //     y4,
            //     x5,
            //     y5,
            //     x6,
            //     y6,
            // };
            // let a = (x1-mouse.x) * (y2-y1)
            canvas.closePath();
            // canvas.fill();
            if (fill) canvas.fill();
            else canvas.stroke();
        };

        hexagonCanvas.current.addEventListener('click', function (eventInfo) {
            console.info(eventInfo);
            let x = eventInfo.offsetX; // || eventInfo.layerX;
            let y = eventInfo.offsetY; // || eventInfo.layerY;
            console.info(x, y);
            let hexY = Math.floor(y / (hexHeight + SIDE_LENGTH));
            let hexX = Math.floor(
                (x - (hexY % 2) * hexRadius) / hexRectangleWidth
            );
            let screenX = hexX * hexRectangleWidth + (hexY % 2) * hexRadius;
            let screenY = hexY * (hexHeight + SIDE_LENGTH);
            canvas.clearRect(0, 0, canvas.width, canvas.height);
            drawBoard(canvas); //перерисовка на mousemove

            canvas.fillStyle = '#008000';
            // canvas.beginPath();
            // canvas.moveTo(screenX, screenY);
            // canvas.lineTo(screenX + 10, screenY + 10);
            // canvas.closePath();
            // console.info(screenX, screenY);
            // canvas.fill();
            drawHexagon(canvas, screenX, screenY, true);
        });
        drawBoard(canvas);
    }, []);

    return (
        <canvas
            ref={hexagonCanvas}
            className="canvas"
            width={500}
            height={500}
        />
    );
};

export default CanvasHexagon;
