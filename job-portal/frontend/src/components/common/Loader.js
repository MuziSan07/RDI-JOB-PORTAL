import React from 'react';

const Loader = () => {
    return (
        <div style={styles.loaderContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading...</p>
        </div>
    );
};

const styles = {
    loaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    spinner: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        marginTop: '20px',
        fontSize: '16px',
        color: '#666',
    },
};

export default Loader;