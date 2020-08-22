import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

const ModalStatistics = ({statistics, show, onHide}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">Статистика</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Вероятность</th>
                            <th>Всего доменов</th>
                            <th>Неодносвязных доменов</th>
                            <th>Количество ячеек</th>
                            <th>Количество ячеек с 1</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statistics.map(
                            (
                                {
                                    id,
                                    probability,
                                    domainCount,
                                    nonTrivialDomainCount,
                                    hexCount,
                                    oneValueHexCount,
                                },
                                index
                            ) => (
                                <tr key={id}>
                                    <td>{index + 1}</td>
                                    <td>{probability}</td>
                                    <td>{domainCount}</td>
                                    <td>{nonTrivialDomainCount}</td>
                                    <td>{hexCount}</td>
                                    <td>{oneValueHexCount}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ModalStatistics.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default ModalStatistics;
