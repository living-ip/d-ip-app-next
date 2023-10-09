import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';

const SignMessageComponent = () => {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('This is a message');
    const [signedMessage, setSignedMessage] = useState(null);

    const handleSignMessage = useCallback(async () => {
        if (!publicKey || !signMessage) {
            console.error('Wallet not connected');
            return;
        }
        // Create a buffer from your message
        const messageBuffer = Buffer.from(message);

        try {
            // Sign the message
            const signature = await signMessage(messageBuffer);

            // The signature can now be sent to your backend for verification
            // or used however you need to.

            setSignedMessage(signature);
        } catch (error) {
            console.error('Failed to sign message:', error);
        }
    }, [publicKey, signMessage, message]);

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to sign"
            />
            <button onClick={handleSignMessage}>Sign Message</button>
            {signedMessage && (
                <div>
                    <h3>Signed Message:</h3>
                    <pre>{signedMessage.toString('hex')}</pre>
                </div>
            )}
        </div>
    );
};

export default SignMessageComponent;
