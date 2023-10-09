import React from 'react';
import {WalletDisconnectButton, WalletModalProvider, WalletMultiButton} from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletConnectorAndModal = ({children}) => {
    return (
        <WalletModalProvider>
            <WalletMultiButton/>
            <WalletDisconnectButton/>
            {children}
        </WalletModalProvider>
    );
};

export default WalletConnectorAndModal;