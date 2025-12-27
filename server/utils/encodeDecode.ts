import _sodium from 'libsodium-wrappers';
import {SodiumCrypto} from "../types/index.js";

export const encodeDecode = async (
    value: any,
    type: 'encode' | 'decode' = 'encode'
): Promise<any> => {
    await _sodium.ready;
    const sodium = _sodium;

    const secret = process.env.SIMPLE_CRYPTO_SECRET || '';
    const key = sodium.crypto_generichash(32, secret);
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

    try {
        if (type === 'encode') {
            const jsonValue = JSON.stringify(value);
            const cipher = sodium.crypto_secretbox_easy(
                sodium.from_string(jsonValue),
                nonce,
                key
            );

            const payload: SodiumCrypto = {
                nonce: sodium.to_base64(nonce),
                cipher: sodium.to_base64(cipher),
            };

            return JSON.stringify(payload);
        } else {
            const { nonce, cipher } = JSON.parse(value as string) as SodiumCrypto;
            const decrypted = sodium.crypto_secretbox_open_easy(
                sodium.from_base64(cipher),
                sodium.from_base64(nonce),
                key
            );
            return JSON.parse(sodium.to_string(decrypted)) as any;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Encryption/decryption failed');
    }
}