import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

import ModalForm from './ModalForm';
import './Footer.css';

const Footer = ({sizes, onSizesChange, onProbabilityChange}) => {
    const [modalShow, setModalShow] = useState(false);
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
                        variant="dark"
                        type="submit"
                        disabled={!isValid}
                    >
                        Авто
                    </Button>
                </Form>

                <Button variant="primary" onClick={() => setModalShow(true)}>
                    Указать размеры
                </Button>

                <ModalForm
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    updateSizes={(sizes) => onSizesChange(sizes)}
                />
            </Container>
        </footer>
    );
};

Footer.propTypes = {
    sizes: PropTypes.object.isRequired,
    onSizesChange: PropTypes.func.isRequired,
    onProbabilityChange: PropTypes.func.isRequired,
};

export default Footer;
