// src/components/ErrorMessage.js
'use client'

import React from 'react';
import PropTypes from 'prop-types';

function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <div className="error-message" role="alert">
            {message}
        </div>
    );
}

ErrorMessage.propTypes = {
    message: PropTypes.string
};

export default ErrorMessage;