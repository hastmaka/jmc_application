export const formatMoney = (value: number | string, sign: boolean = true): string => {
	// Convert cents to dollars
	// const dollars = Number(value) / 100;

	// Format with two decimal places
	let formattedMoney = sign ? Number(value).toFixed(2) : value.toString();

	// Format the integer part with commas for a thousand separators
	formattedMoney = formattedMoney.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// Prepend a dollar sign
	if(sign) formattedMoney = '$' + formattedMoney;

	return formattedMoney;
};