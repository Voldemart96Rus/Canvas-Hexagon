import React, {useState, useEffect} from 'react';
import CanvasHexagon from './components/CanvasHexagon2';

import './App.css';

const HEXAGON_ANGLE = 0.523598776; //30 градусов в радианах
const SIDE_LENGTH = 55; //длина стороны в пикселях
const hexHeight = Math.sin(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRadius = 52; //Math.cos(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRectangleWidth = 104;

const App = () => {
    const [hexagonSettings, setHexagonSettings] = useState([]);
    const [hexagonMap, setHexagonMap] = useState(new Map());

    useEffect(() => {
        const hexMap = new Map();
        const result = [];
        const L = 3,
            M = 5,
            N = 7;

        let count = N;

        let x = 0;
        let y = 0;

        let row = 1;
        let col = 1;

        for (let l = L; l > 0; l--) {
            x = l * hexRadius;
            y = (SIDE_LENGTH + hexHeight) * (L - l);
            for (let i = 0; i < count; i++) {
                const id = col++ + ' ' + row;
                result.push({
                    x: x + hexRectangleWidth * i - hexRadius,
                    y,
                    color: '#389ce4',
                    col,
                    row,
                    value: id,
                    id,
                });
                hexMap.set(id, result[result.length - 1]);
            }
            col = 1;
            row++;

            count++;
        }

        count = N + L - 1;

        for (let m = 1; m < M; m++) {
            x = m * hexRadius;
            y = (SIDE_LENGTH + hexHeight) * (L + m - 1);
            if (M - m < L) count--;
            for (let i = 0; i < count; i++) {
                result.push({
                    x: x + hexRectangleWidth * i,
                    y,
                    color: '#389ce4',
                    col,
                    row,
                    value: col++ + ' ' + row,
                    id: col - 1 + ' ' + row,
                });
            }
            col = 1;
            row++;
        }
        // console.info(hexMap);
        setHexagonMap(hexMap);
        setHexagonSettings(result);
    }, []);

    // const getHexagonSettingsSet = () => {};

    const onClick = (e) => {
        console.info(hexagonMap);
    };

    return (
        <section className="App">
            <div className="wrap" onClick={onClick}>
                {hexagonSettings.map((settings) => (
                    <CanvasHexagon
                        key={`${settings.x}:${settings.y}`}
                        settings={settings}
                    />
                ))}
            </div>
        </section>
    );
};

export default App;
