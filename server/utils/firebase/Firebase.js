// const firebase = require('firebase-admin');
//
// const serviceAccount = require('../firebase/dmv-services-ac004-firebase-adminsdk-wppgi-ffe1f5d081.json');
// firebase.initializeApp({
// 	credential: firebase.credential.cert(serviceAccount)
// });
//
// console.log('firebase initialized');
//
// module.exports = {
// 	getUserById: function (uid) {
// 		return new Promise(function (resolve, reject) {
// 			firebase.auth().getUser(uid)
// 				.then(function (user) {debugger
// 					resolve(user);
// 				})
// 				.catch(function (error) {
// 					reject(error)
// 				})
// 		});
// 	},
// 	getUserByEmail: function (email) {
// 		return new Promise(function (resolve, reject) {
// 			firebase.auth().getUserByEmail(email)
// 				.then(function (user) {
// 					resolve(user);
// 				})
// 				.catch(function (error) {
// 					if(error.errorInfo.code === 'auth/user-not-found') {
// 						resolve(null);
// 					} else {
// 						reject(error);
// 					}
// 				})
// 		});
// 	},
// 	createUser: async (fullName, email, password) => {
// 		try {
// 			const firebaseUser = await firebase.auth().createUser({
// 				email: email,
// 				emailVerified: true,
// 				password: password,
// 				displayName: fullName,
// 				disabled: false,
// 			})
//
// 			return firebaseUser.uid
// 		} catch(error) {
// 			return {res: 'error', error}
// 		}
// 	},
// 	deleteUser: function(uid) {
// 		firebase.auth().deleteUser(uid).then(() => {
// 			console.log('Successfully deleted user');
// 		}).catch((error) => {
// 			console.log('Error deleting user:', error);
// 		});
// 	},
// 	updateUser: function(uid, data) {
// 		return new Promise(async function (resolve, reject) {
// 			try {
// 				const userUpdated = await firebase.auth().updateUser(uid, data)
// 				debugger
// 				resolve(userUpdated)
// 			} catch(error) {
// 				reject(error)
// 			}
// 		})
// 	},
// 	updateUserVerifiedEmail: function (uid, verified) {
// 		return new Promise(function (resolve, reject) {
// 			firebase.auth().updateUser(uid, {
// 					emailVerified: verified
// 				})
// 				.then(function() {
// 					resolve();
// 				})
// 				.catch(function(error) {
// 					reject(error)
// 				});
// 		});
// 	},
// 	updateUserEmail: function (uid, email) {
// 		firebase.auth().updateUser(uid, {
// 				email: email
// 			})
// 			.then(function(userRecord) {
// 				console.log('email updated successfully')
// 			})
// 			.catch(function(error) {
// 				console.log(error)
// 			});
// 	},
// 	updateUserDisabledStatus: function (uid, disabled) {
// 		firebase.auth().updateUser(uid, {
// 				disabled: disabled
// 			})
// 			.then(function(userRecord) {
// 				console.log('email updated successfully')
// 			})
// 			.catch(function(error) {
// 				console.log(error)
// 			});
// 	},
// 	verifyIdToken: function (idToken) {
// 		return new Promise(function (resolve, reject) {
// 			firebase.auth().verifyIdToken(idToken, true)
// 				.then(function(decodedToken) {
// 					resolve(decodedToken);
// 				})
// 				.catch(function(error) {
// 					resolve(error);
// 				});
// 		});
// 	},
// 	getUserFromFirebase: function () {
// 		return new Promise(async function (resolve, reject) {
// 			try {
// 				const listUsersResult = await firebase.auth().listUsers();
// 				resolve(listUsersResult)
// 			} catch(error) {
// 				reject(error)
// 			}
// 		})
//
// 	}
// }