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

const Footer = ({
    hexagon,
    onSizesChange,
    updateDomains,
    clearGrid,
    showAlert,
}) => {
    const [statisticsShow, setStatisticsShow] = useState(false);
    const [formShow, setFormShow] = useState(true);
    const [probability, setProbability] = useState('');
    const [statistics, setStatistics] = useState([]);

    const isProbabilityValid = (p) => 0.01 <= p && p <= 0.99;

    const updateStatistics = (hexagon, probability) => {
        showAlert();
        const newRecord = {
            id: uuidv4(),
            probability: probability,
            domainCount: hexagon.domains.size,
            simpleDomainCount: [...hexagon.domains.values()].filter(
                (domain) => domain.size === 1
            ).length,
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
    onSizesChange: PropTypes.func.isRequired,
    updateDomains: PropTypes.func.isRequired,
    clearGrid: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
};

export default Footer;
