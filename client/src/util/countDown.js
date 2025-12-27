export const countDown = (number) => {
	let count = number || 60; // Set the initial count to 60 seconds
	
	// Define the interval function to decrement the count every second
	const interval = setInterval(() => {
		count--; // Decrement the count
		
		// Check if the count has reached 0
		if (count === 0) {
			clearInterval(interval); // Stop the countdown
			console.log("Countdown finished!"); // Display a message indicating the end of the countdown
		}
	}, 1000); // Run the interval function every 1000 milliseconds (1 second)
}