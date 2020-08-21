import React, {useState, useEffect} from 'react';
import CanvasHexagon from './components/CanvasHexagon2';
import Container from 'react-bootstrap/Container';

import {L_INITIAL_VALUE, M_INITIAL_VALUE, N_INITIAL_VALUE} from './constants';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Footer from './components/Footer';

const HEXAGON_ANGLE = 0.523598776; //30 градусов в радианах
const SIDE_LENGTH = 55; //длина стороны в пикселях
const hexHeight = Math.sin(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRadius = 52; //Math.cos(HEXAGON_ANGLE) * SIDE_LENGTH;
const hexRectangleWidth = 104;
const COLOR = '#389ce4';
const LESS = [
    [-1, -1],
    [0, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 0],
];
const EVEN = [
    [-1, -1],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
];
const MORE = [
    [0, -1],
    [1, -1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
];

const App = () => {
    const [hexagon, setHexagon] = useState({
        settings: [],
        map: new Map(),
        marked: [],
    });
    const [probability, setProbability] = useState(0);
    const [sizes, setSizes] = useState({
        L: L_INITIAL_VALUE,
        M: M_INITIAL_VALUE,
        N: N_INITIAL_VALUE,
    });

    useEffect(() => {
        const {L, M, N} = sizes;
        const hexMap = new Map();
        const result = [];

        let count = N;

        let x = 0;
        let y = 0;

        let row = 1;
        let col = 1;

        for (let l = L; l > 0; l--) {
            x = l * hexRadius;
            y = (SIDE_LENGTH + hexHeight) * (L - l);
            for (let i = 0; i < count; i++) {
                const id = col + ' ' + row;
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
                col++;
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
                const id = col + ' ' + row;
                result.push({
                    x: x + hexRectangleWidth * i,
                    y,
                    color: '#389ce4',
                    col,
                    row,
                    value: id,
                    // value: col++ + ' ' + row,
                    id,
                });
                hexMap.set(id, result[result.length - 1]);
                col++;
            }
            col = 1;
            row++;
        }

        setHexagon({...hexagon, settings: result, map: hexMap});
    }, [sizes.L, sizes.M, sizes.N, sizes]);

    const randColor = () => {
        let r = Math.floor(Math.random() * 256),
            g = Math.floor(Math.random() * 256),
            b = Math.floor(Math.random() * 256);

        return `rgb( ${r}, ${g}, ${b})`;
    };

    const checkHexagon = (curHex, markedHex) => {
        if (curHex.row === markedHex.row && curHex.col === markedHex.col) {
            return true;
        }

        return false;
    };

    const markedHex = (marked, cur, map, type) => {
        marked.forEach((element) => {
            for (let i = 0; i < type.length; i++) {
                const settings = {
                    row: cur.row + type[i][1],
                    col: cur.col + type[i][0],
                };
                if (checkHexagon(settings, element.id)) {
                    const color = element.id.color;
                    marked.push({
                        id: cur,
                        domain: color,
                    });
                    cur.color = color;
                    cur.value = '1';
                    map.set(cur.id, cur);
                    break;
                }
            }
        });

        return [marked, map];
    };

    const paint = (notVisited) => {
        let marked = hexagon.marked;
        let map = hexagon.map;
        for (let i = 0; i < notVisited.length; i++) {
            const cur = notVisited[i];
            if (marked.length === 0) {
                const color = randColor();
                marked.push({
                    id: cur,
                    domain: color,
                });
                cur.color = color;
                cur.value = '1';
                map.set(cur.id, cur);
            } else {
                if (cur.row < sizes.L) {
                    markedHex(marked, cur, map, LESS);
                } else if (cur.row === sizes.L) {
                    markedHex(marked, cur, map, EVEN);
                } else {
                    markedHex(marked, cur, map, MORE);
                }
            }
        }
        setHexagon({
            ...hexagon,
            map,
            marked,
        });
    };

    const onClick = (e) => {
        const currentHex = hexagon.map.get(e.target.id);

        paint([currentHex]);
    };

    return (
        <>
            <main className="App">
                <Container>
                    <div className="wrap">
                        <div onClick={onClick}>
                            {hexagon.settings.map((settings) => (
                                <CanvasHexagon
                                    key={`${settings.x}:${settings.y}`}
                                    settings={settings}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </main>
            <Footer
                sizes={sizes}
                onSizesChange={(sizes) => setSizes(sizes)}
                onProbabilityChange={(p) => setProbability(p)}
            />
        </>
    );
};

export default App;
