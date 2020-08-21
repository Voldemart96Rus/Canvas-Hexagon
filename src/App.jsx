import React, {useState, useEffect} from 'react';
import Hexagon from './components/Hexagon';
import Container from 'react-bootstrap/Container';

import {
    L_INITIAL_VALUE,
    M_INITIAL_VALUE,
    N_INITIAL_VALUE,
    SIDE_LENGTH,
    HEX_HEIGHT,
    HEX_RADIUS,
    HEX_RECTANGLE_WIDTH,
    LESS,
    EVEN,
    MORE,
    GAP,
    COLOR,
} from './constants';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Footer from './components/Footer';

const App = () => {
    const [hexagon, setHexagon] = useState({
        settings: [],
        map: new Map(),
        domains: new Map(),
        elementDomain: new Map(),
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
        const settings = [];

        let count = N;

        let x = 0;
        let y = 0;

        let row = 1;
        let col = 1;

        for (let l = L; l > 0; l--) {
            x = l * HEX_RADIUS;
            y = (SIDE_LENGTH + HEX_HEIGHT) * (L - l);
            for (let i = 0; i < count; i++) {
                const id = col + ' ' + row;
                settings.push({
                    x: x + HEX_RECTANGLE_WIDTH * i - HEX_RADIUS, // + GAP * col
                    y,
                    color: COLOR,
                    col,
                    row,
                    value: '',
                    id,
                });
                hexMap.set(id, settings[settings.length - 1]);
                col++;
            }
            col = 1;
            row++;
            count++;
        }

        count = N + L - 1;

        for (let m = 1; m < M; m++) {
            x = m * HEX_RADIUS;
            y = (SIDE_LENGTH + HEX_HEIGHT) * (L + m - 1);
            if (M - m < L) count--;
            for (let i = 0; i < count; i++) {
                const id = col + ' ' + row;
                settings.push({
                    x: x + HEX_RECTANGLE_WIDTH * i, // + GAP * col),
                    y,
                    color: COLOR,
                    col,
                    row,
                    value: '',
                    id,
                });
                hexMap.set(id, settings[settings.length - 1]);
                col++;
            }
            col = 1;
            row++;
        }

        setHexagon({...hexagon, settings: settings, map: hexMap});
        // eslint-disable-next-line
    }, [sizes.L, sizes.M, sizes.N, sizes]);

    const randColor = () => {
        let r = Math.floor(Math.random() * 256),
            g = Math.floor(Math.random() * 256),
            b = Math.floor(Math.random() * 256);

        return `rgb(${r}, ${g}, ${b})`;
    };

    const updateDomains = (el) => {
        const foundDomainIds = [];
        const {elementDomain, domains, map} = hexagon;

        // Если 0
        if (el.value === '') {
            let neighborOffsets;
            if (el.row < sizes.L) neighborOffsets = LESS;
            if (el.row === sizes.L) neighborOffsets = EVEN;
            if (el.row > sizes.L) neighborOffsets = MORE;

            // Цикл по соседям
            neighborOffsets.forEach(([colOffset, rowOffset]) => {
                const neighbor = {
                    row: el.row + rowOffset,
                    col: el.col + colOffset,
                };
                const neighborId = neighbor.col + ' ' + neighbor.row;

                // Если сосед входит в домен, сохраняем его
                if (hexagon.elementDomain.has(neighborId)) {
                    foundDomainIds.push(hexagon.elementDomain.get(neighborId));
                }
            });

            // Объединяем найденные домены в один домен
            // TODO Использовать другой id
            const newDomainId = Date.now();
            const newDomain = {elements: [el], color: randColor()};
            elementDomain.set(el.id, newDomainId);

            new Set(foundDomainIds).forEach((domainId) => {
                const domainElements = hexagon.domains.get(domainId).elements;
                newDomain.elements.push(...domainElements);
                // Удаляем старый домен
                domains.delete(domainId);
                // Обновляем id домена у элементов старого домена
                domainElements.forEach((el) => {
                    elementDomain.set(el.id, newDomainId);
                });
            });

            // Красим элементы нового домена и обновляем значение
            newDomain.elements.forEach((el) => {
                const currentElement = map.get(el.id);
                currentElement.color = newDomain.color;
                currentElement.value = '1';
            });

            domains.set(newDomainId, newDomain);
            setHexagon({...hexagon, map, domains, elementDomain});
        }
    };

    const onClick = (e) => {
        const currentHex = hexagon.map.get(e.target.id);

        if (currentHex) updateDomains(currentHex);
    };

    return (
        <>
            <main className="App">
                <Container>
                    <div className="wrap">
                        <div onClick={onClick}>
                            {hexagon.settings.map((settings) => (
                                <Hexagon
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
