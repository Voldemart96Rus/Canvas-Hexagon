import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

import ModalForm from './ModalForm';
import ModalStatistics from './ModalStatistics';
import './Footer.css';

const Footer = ({onSizesChange, onProbabilityChange}) => {
    const [statisticsShow, setStatisticsShow] = useState(false);
    const [formShow, setFormShow] = useState(false);
    const [probability, setProbability] = useState('');

    const isProbabilityValid = (p) => 0.01 <= p && p <= 0.99;

    const handleProbabilityChange = (e) => {
        e.preventDefault();

        if (
            (/^0\.\d+$/.test(probability) && isProbabilityValid(probability)) ||
            probability === ''
        ) {
            setProbability('');
            onProbabilityChange(Number(probability));
        }
    };

    const isValid = isProbabilityValid(probability);

    return (
        <footer className="footer py-4">
            <Container className="d-flex justify-content-end align-items-center">
                <Form
                    className="d-flex align-items-center"
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
                    <Button
                        className="mr-5"
                        variant="primary"
                        type="submit"
                        disabled={!isValid}
                    >
                        Авто
                    </Button>
                </Form>

                <Button
                    variant="primary"
                    className="mr-3"
                    onClick={() => setFormShow(true)}
                >
                    Размеры
                </Button>
                <ModalForm
                    show={formShow}
                    onHide={() => setFormShow(false)}
                    updateSizes={(sizes) => onSizesChange(sizes)}
                />

                <Button variant="info" onClick={() => setStatisticsShow(true)}>
                    Статистика
                </Button>
                <ModalStatistics
                    show={statisticsShow}
                    onHide={() => setStatisticsShow(false)}
                />
            </Container>
        </footer>
    );
};

Footer.propTypes = {
    onSizesChange: PropTypes.func.isRequired,
    onProbabilityChange: PropTypes.func.isRequired,
};

export default Footer;
