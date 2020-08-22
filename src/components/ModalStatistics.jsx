import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const ModalStatistics = ({show, onHide}) => {
    const statistics = [
        {
            id: Date.now(),
            probability: 0.33,
            domainCount: 10,
            simpleDomainCount: 10,
            hexCount: 30,
            oneValueHexCount: 10,
        },
        {
            id: Date.now(),
            probability: 0.33,
            domainCount: 10,
            simpleDomainCount: 10,
            hexCount: 30,
            oneValueHexCount: 10,
        },
    ];

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">Статистика</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Вероятность</th>
                            <th>Всего доменов</th>
                            <th>Неодносвязных доменов</th>
                            <th>Количество ячеек</th>
                            <th>Количество 1 ячеек</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statistics.map(
                            (
                                {
                                    id,
                                    probability,
                                    domainCount,
                                    simpleDomainCount,
                                    hexCount,
                                    oneValueHexCount,
                                },
                                index
                            ) => (
                                <tr key={id}>
                                    <td>{index + 1}</td>
                                    <td>{probability}</td>
                                    <td>{domainCount}</td>
                                    <td>{simpleDomainCount}</td>
                                    <td>{hexCount}</td>
                                    <td>{oneValueHexCount}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalStatistics;
