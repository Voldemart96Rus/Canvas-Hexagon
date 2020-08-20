import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

import {MIN_SIZE, MAX_SIZE} from '../constants';

const SizeInputGroup = ({value, name, onChange, isSizeValid}) => (
    <Form.Group>
        <div className="d-flex align-items-center">
            <Form.Label className="modal-form-label mr-4 mb-0">
                {name}
            </Form.Label>
            <Form.Control
                className="modal-form-input"
                name={name}
                value={value === 0 ? '' : value}
                isValid={isSizeValid(value)}
                isInvalid={!isSizeValid(value)}
                onChange={onChange}
                size="sm"
            />
            <div className="ml-4 flex-grow-1">
                <Form.Control
                    type="range"
                    value={value}
                    name={name}
                    onChange={onChange}
                    size="sm"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                />
            </div>
        </div>
    </Form.Group>
);

SizeInputGroup.propTypes = {
    value: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isSizeValid: PropTypes.func.isRequired,
};

export default SizeInputGroup;
