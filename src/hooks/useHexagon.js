import {useState, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';

import {
    SIDE_LENGTH,
    HEX_HEIGHT,
    HEX_RADIUS,
    HEX_RECTANGLE_WIDTH,
    LESS,
    EVEN,
    MORE,
    COLOR,
} from '../constants';

const useHexagon = (sizes) => {
    const [hexagon, setHexagon] = useState({
        settings: [],
        map: new Map(),
        domains: new Map(),
        elementDomain: new Map(),
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
                    x: x + HEX_RECTANGLE_WIDTH * i - HEX_RADIUS,
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
                    x: x + HEX_RECTANGLE_WIDTH * i,
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

        setHexagon({
            ...hexagon,
            settings: settings,
            map: hexMap,
            domains: new Map(),
            elementDomain: new Map(),
        });
        // eslint-disable-next-line
    }, [sizes.L, sizes.M, sizes.N, sizes]);

    const randColor = () => {
        let r = Math.floor(Math.random() * 256),
            g = Math.floor(Math.random() * 256),
            b = Math.floor(Math.random() * 256);

        return `rgb(${r}, ${g}, ${b})`;
    };

    const clearGrid = () =>
        setHexagon({
            settings: hexagon.settings.map((el) => ({
                ...el,
                color: COLOR,
                value: '',
            })),
            domains: new Map(),
            elementDomain: new Map(),
        });

    const updateDomains = (el) => {
        const {elementDomain, domains, map} = hexagon;
        const foundDomainIds = [];

        // Если элемент не входит в домен
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

                // Если сосед входит в домен, сохраняем id домена
                if (elementDomain.has(neighborId)) {
                    foundDomainIds.push(elementDomain.get(neighborId));
                }
            });

            // Объединяем найденные домены в один домен
            const newDomainId = uuidv4();
            const newDomain = {elements: [el], color: randColor()};
            elementDomain.set(el.id, newDomainId);

            // Идем по найденным id доменов
            new Set(foundDomainIds).forEach((domainId) => {
                const domainElements = domains.get(domainId).elements;
                newDomain.elements.push(...domainElements);
                // Удаляем старый домен
                domains.delete(domainId);
                // Обновляем id домена у элементов старого домена
                domainElements.forEach((el) =>
                    elementDomain.set(el.id, newDomainId)
                );
            });

            // Красим элементы нового домена и обновляем значение
            newDomain.elements.forEach((el) => {
                const currentElement = map.get(el.id);
                currentElement.color = newDomain.color;
                currentElement.value = '1';
            });

            domains.set(newDomainId, newDomain);
        } else {
            // Если элемент входит в домен
            // Удаляем его из домена
            el.value = '';
            const currentDomainId = elementDomain.get(el.id);
            elementDomain.delete(el.id);
            // Полностью расформировываем домен
            const elements = domains
                .get(currentDomainId)
                .elements.filter((item) => {
                    item.color = COLOR;
                    item.value = '';
                    elementDomain.delete(item.id);
                    return item.id !== el.id;
                });

            domains.delete(currentDomainId);
            setHexagon({...hexagon, domains, elementDomain, map});
            // Группируем оставшиеся элементы старого домена
            elements.forEach((el) => updateDomains(el));
        }

        setHexagon({...hexagon, domains, elementDomain, map});
    };

    return {hexagon, updateDomains, clearGrid};
};

export default useHexagon;
