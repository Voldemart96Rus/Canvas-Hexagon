import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import {v4 as uuidv4} from 'uuid';

import ModalForm from './ModalForm';
import ModalStatistics from './ModalStatistics';
import {MAX_RECORDS_COUNT} from '../constants';
import './Footer.css';

import {LESS, EVEN, MORE} from '../constants';

const Footer = ({
    hexagon,
    onSizesChange,
    updateDomains,
    clearGrid,
    showAlert,
    sizes,
}) => {
    const [statisticsShow, setStatisticsShow] = useState(false);
    const [formShow, setFormShow] = useState(true);
    const [probability, setProbability] = useState('');
    const [statistics, setStatistics] = useState([]);

    const isProbabilityValid = (p) => 0.01 <= p && p <= 0.99;

    const addHexagonContour = (map) => {
        const hexMap = new Map(map);
        const L = sizes.L + 1;
        const M = sizes.M + 1;
        const N = sizes.N + 1;

        const settings = [];

        let count = N;

        let row = 0;
        let col = 0;

        for (let l = L; l > 0; l--) {
            for (let i = 0; i < count; i++) {
                const id = col + ' ' + row;
                if (!hexMap.has(id)) {
                    settings.push({
                        col,
                        row,
                        value: '',
                        id,
                    });
                    hexMap.set(id, settings[settings.length - 1]);
                }
                col++;
            }
            col = 0;
            row++;
            count++;
        }

        count = N + L - 1;

        for (let m = 1; m < M; m++) {
            if (M - m < L) count--;
            for (let i = 0; i < count; i++) {
                const id = col + ' ' + row;
                if (!hexMap.has(id)) {
                    settings.push({
                        col,
                        row,
                        value: '',
                        id,
                    });
                    hexMap.set(id, settings[settings.length - 1]);
                }
                col++;
            }
            col = 0;
            row++;
        }

        return hexMap;
    };

    const getNonTrivialDomain = (map, startId) => {
        const stack = [map.get(startId)];
        const encounteredDomains = new Set();

        while (stack.length !== 0) {
            const currentElement = stack.pop();
            // При первом проходе удаляем все нулевые гексагоны,
            // кроме тех, что изолированы внутри некоторого домена.
            map.delete(currentElement.id);
            let neighborOffsets;
            if (currentElement.row < sizes.L) neighborOffsets = LESS;
            if (currentElement.row === sizes.L) neighborOffsets = EVEN;
            if (currentElement.row > sizes.L) neighborOffsets = MORE;

            // Цикл по соседям
            neighborOffsets.forEach(([colOffset, rowOffset]) => {
                const neighborCoordinates = {
                    row: currentElement.row + rowOffset,
                    col: currentElement.col + colOffset,
                };

                const neighborId =
                    neighborCoordinates.col + ' ' + neighborCoordinates.row;

                if (map.has(neighborId)) {
                    const neighbor = map.get(neighborId);
                    // Если сосед не помеченный, то добавляем его в стек
                    if (neighbor.value === '') {
                        stack.push(neighbor);
                    } else {
                        // Записываем встреченный домен
                        encounteredDomains.add(
                            hexagon.elementDomain.get(neighborId)
                        );
                    }
                }
            });
        }
        const isNonTrivialDomain =
            encounteredDomains.size === 1
                ? {flag: true, id: encounteredDomains.values().next().value}
                : {flag: false, id: null};

        return {notVisitedMap: map, isNonTrivialDomain};
    };

    const updateStatistics = (hexagon, probability) => {
        showAlert();
        const getNonTrivialDomainCount = () => {
            const nonTrivialDomains = new Set();
            // Добавляем нулевой контур единичной ширины к гексагональной решетке.
            const map = addHexagonContour(hexagon.map);
            // Удаляем все нулевые элементы, неизолированные доменами.
            let {notVisitedMap} = getNonTrivialDomain(map, '0 0');
            // Идем по всем изолированным нулевым элементам.
            let startElement = [...notVisitedMap.values()].filter(
                (el) => el.value === ''
            )[0];
            while (startElement !== undefined) {
                const result = getNonTrivialDomain(
                    notVisitedMap,
                    startElement.id
                );
                if (result.isNonTrivialDomain.flag) {
                    nonTrivialDomains.add(result.isNonTrivialDomain.id);
                }
                notVisitedMap = result.notVisitedMap;
                startElement = [...notVisitedMap.values()].filter(
                    (el) => el.value === ''
                )[0];
            }

            return nonTrivialDomains.size;
        };

        const newRecord = {
            id: uuidv4(),
            probability: probability,
            domainCount: hexagon.domains.size,
            nonTrivialDomainCount: getNonTrivialDomainCount(),
            hexCount: hexagon.settings.length,
            oneValueHexCount: hexagon.settings.filter((el) => el.value === '1')
                .length,
        };

        setStatistics([
            newRecord,
            ...statistics.slice(0, MAX_RECORDS_COUNT - 1),
        ]);
    };

    const handleProbabilityChange = (e) => {
        e.preventDefault();

        if (
            (/^0\.\d+$/.test(probability) && isProbabilityValid(probability)) ||
            probability === ''
        ) {
            clearGrid();
            hexagon.settings.forEach((el) => {
                if (Math.random() < probability) updateDomains(el);
            });
            updateStatistics(hexagon, probability);
            setProbability('');
        }
    };

    const isValid = isProbabilityValid(probability);

    return (
        <footer className="footer py-4">
            <Container className="footer-container">
                <span className="domains-count hide-mobile">
                    Количество доменов: {hexagon.domains.size}
                </span>
                <Form
                    className="probability-form d-flex align-items-center"
                    onSubmit={handleProbabilityChange}
                >
                    <Form.Control
                        className="probability-input mr-3"
                        isValid={isValid}
                        isInvalid={!(isValid || probability === '')}
                        placeholder="Вероятность"
                        value={probability}
                        onChange={(e) => setProbability(e.target.value.trim())}
                    />
                    <Button type="submit" disabled={!isValid}>
                        Авто
                    </Button>
                </Form>
                <div className="footer-group">
                    <span className="domains-count show-mobile">
                        Доменов: {hexagon.domains.size}
                    </span>
                    <div className="button-group">
                        <Button
                            className="footer-button mr-3"
                            onClick={() => setFormShow(true)}
                        >
                            Размеры
                        </Button>
                        <ModalForm
                            show={formShow}
                            onHide={() => setFormShow(false)}
                            updateSizes={(sizes) => onSizesChange(sizes)}
                        />
                        <Button
                            className="footer-button"
                            variant="info"
                            onClick={() => setStatisticsShow(true)}
                        >
                            Статистика
                        </Button>
                        <ModalStatistics
                            statistics={statistics}
                            show={statisticsShow}
                            onHide={() => setStatisticsShow(false)}
                        />
                    </div>
                </div>
            </Container>
        </footer>
    );
};

Footer.propTypes = {
    hexagon: PropTypes.object.isRequired,
    sizes: PropTypes.object.isRequired,
    onSizesChange: PropTypes.func.isRequired,
    updateDomains: PropTypes.func.isRequired,
    clearGrid: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
};

export default Footer;
