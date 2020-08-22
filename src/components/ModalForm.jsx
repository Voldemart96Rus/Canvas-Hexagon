import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import SizeInputGroup from './SizeInputGroup';

import {
    MIN_SIZE,
    MAX_SIZE,
    L_INITIAL_VALUE,
    M_INITIAL_VALUE,
    N_INITIAL_VALUE,
} from '../constants';
import './ModalForm.css';

const ModalForm = ({show, onHide, updateSizes}) => {
    const [sizes, setSizes] = useState({
        L: L_INITIAL_VALUE,
        M: M_INITIAL_VALUE,
        N: N_INITIAL_VALUE,
    });

    const isSizeValid = (size) => MIN_SIZE <= size && size <= MAX_SIZE;

    const isFormValid = () =>
        Object.values(sizes).every(
            (size) => /^\d+$/.test(size) && isSizeValid(size)
        );

    const onChange = (e) => {
        const value = e.target.value.trim();

        if (/^\d+$/.test(value) || value === '') {
            setSizes({...sizes, [e.target.name]: Number(e.target.value)});
        }
    };

    const onSave = () => {
        updateSizes(sizes);
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">
                    Размеры гексагональной области
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Значениями должны быть целые числа между {MIN_SIZE} и{' '}
                    {MAX_SIZE}.
                </p>
                <Form>
                    <SizeInputGroup
                        value={sizes.L}
                        name="L"
                        onChange={onChange}
                        isSizeValid={isSizeValid}
                    />
                    <SizeInputGroup
                        value={sizes.M}
                        name="M"
                        onChange={onChange}
                        isSizeValid={isSizeValid}
                    />
                    <SizeInputGroup
                        value={sizes.N}
                        name="N"
                        onChange={onChange}
                        isSizeValid={isSizeValid}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className="mr-3"
                    onClick={onSave}
                    disabled={!isFormValid()}
                >
                    Сохранить
                </Button>
                <Button variant="dark" onClick={onHide}>
                    Отменить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ModalForm.propTypes = {
    onHide: PropTypes.func.isRequired,
    updateSizes: PropTypes.func.isRequired,
};

export default ModalForm;
