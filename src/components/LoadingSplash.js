import React from 'react';

// CSS in JS
const styles = {
    ringLoader: {
        display: 'inline-block',
        position: 'relative',
        width: '80px',
        height: '80px',
    },
    ringLoaderChild: {
        boxSizing: 'border-box',
        display: 'block',
        position: 'absolute',
        width: '64px',
        height: '64px',
        margin: '8px',
        border: '8px solid #000000',
        borderRadius: '50%',
        borderColor: '#000000 transparent transparent transparent',
    },
    child1: {
        animationDelay: '-0.45s',
    },
    child2: {
        animationDelay: '-0.3s',
    },
    child3: {
        animationDelay: '-0.15s',
    },
};

// React component
const LoadingSplash = () => (
    <>
        <style>
            {`
        @keyframes lds-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}
        </style>
        <div style={styles.ringLoader}>
            <div style={{
                ...styles.ringLoaderChild,
                animation: 'lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite', ...styles.child1
            }}></div>
            <div style={{
                ...styles.ringLoaderChild,
                animation: 'lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite', ...styles.child2
            }}></div>
            <div style={{
                ...styles.ringLoaderChild,
                animation: 'lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite', ...styles.child3
            }}></div>
            <div style={{
                ...styles.ringLoaderChild,
                animation: 'lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
            }}></div>
        </div>
    </>
);

export default LoadingSplash;
