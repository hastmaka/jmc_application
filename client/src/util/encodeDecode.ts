import _sodium from 'libsodium-wrappers';

export const encodeDecode = async (
    value: any,
    type: 'encode' | 'decode'
): Promise<any> => {
    await _sodium.ready;
    const sodium = _sodium;

    const secret = import.meta.env.VITE_REACT_APP_ENCRYPT_KEY;
    const key = sodium.crypto_generichash(32, secret); // Derive a fixed-length key from the secret
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

    try {
        if (type === 'encode') {
            const jsonValue = JSON.stringify(value); // ✅ FIX: serialize object
            const cipher = sodium.crypto_secretbox_easy(
                sodium.from_string(jsonValue),
                nonce,
                key
            );
            return JSON.stringify({
                nonce: sodium.to_base64(nonce),
                cipher: sodium.to_base64(cipher),
            });
        } else {
            const { nonce, cipher } = JSON.parse(value);
            const decrypted = sodium.crypto_secretbox_open_easy(
                sodium.from_base64(cipher),
                sodium.from_base64(nonce),
                key
            );
            return JSON.parse(sodium.to_string(decrypted));
        }
    } catch (error) {
        console.error(error);
        throw new Error("Encryption/decryption failed");
    }
};