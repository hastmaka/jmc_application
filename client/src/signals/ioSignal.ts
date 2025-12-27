import {io} from "socket.io-client";
// "undefined" means the URL will be computed from the `window.location` object
export const socket = io(import.meta.env.VITE_REACT_APP_IO_URL_SOCKET_IO,{
	// autoConnect: false
	transports: ['websocket'],
	secure: true
})

// in the cb func u can access socket
socket.on("connect", () => {})

//catch all event
// socket.onAny((event, ...args) => {
// 	console.log(event, args);
// });
//generic
// socket.on('connect_error', (error) => {
// 	console.log(error)
// });
// socket.on('connect_timeout', (timeout) => {
// 	console.log('Socket timeout')
// });
// socket.on('disconnect', (reason) => {
// 	console.log('disconnect', reason)
// });
// socket.on('reconnect', (attemptNumber) => {
// 	console.log('Reconnected on Attempt:',attemptNumber )
// });
// socket.on('reconnect_attempt', (attemptNumber) => {
// 	console.log('Reconnecting Attempt:',attemptNumber )
// });