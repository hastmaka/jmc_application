import firebase from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccount from './jmc-transportation-firebase-adminsdk-3mdir-662a2fe094.json' with {type: 'json'};

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as ServiceAccount)
});

console.log('firebase initialized');

const verifyIdToken = function (idToken: string) {
    return new Promise(function (resolve, reject) {
        firebase.auth().verifyIdToken(idToken, true)
            .then(function(decodedToken: Record<string, any>) {
                resolve(decodedToken);
            })
            .catch(function(error: any) {
                resolve(error);
            });
    });
}

export {
    verifyIdToken
}