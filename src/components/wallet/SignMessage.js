import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';
import { MESSAGE } from "@/lib/const"
import { connectWallet } from '@/lib/user';
import bs58 from 'bs58';

const SignMessageComponent = ({userId}) => {
    const { publicKey, signMessage } = useWallet();
    const [signedMessage, setSignedMessage] = useState(null);

    const handleSignMessage = useCallback(async () => {
        if (!publicKey || !signMessage) {
            console.error('Wallet not connected');
            return;
        }
        // Create a buffer from your message
        const messageBuffer = Buffer.from(MESSAGE);

        try {
            // Sign the message
            const signature = await signMessage(messageBuffer);

            // The signature can now be sent to your backend for verification
            // or used however you need to.

            setSignedMessage(signature);
            const connected = await connectWallet(userId, publicKey.toBase58(), bs58.encode(signature));
            console.log(connected);
        } catch (error) {
            console.error('Failed to sign message:', error);
        }
    }, [userId, publicKey, signMessage]);

    return (
        <div>
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
