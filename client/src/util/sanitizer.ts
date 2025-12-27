export function phone(input: string) {
    if (!input) return '';

    // 1. Remove everything except digits, + and -
    let cleaned = input.replace(/[^0-9+-]/g, '');

    // 2. Handle +
    if (cleaned.startsWith('+')) {
        // keep the first +, remove any others
        cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
    } else {
        // remove all + if it's not the first character
        cleaned = cleaned.replace(/\+/g, '');
    }

    // 3. Remove leading or trailing dashes
    cleaned = cleaned.replace(/^-+/, '').replace(/-+$/, '');

    // 4. Prevent multiple consecutive dashes
    cleaned = cleaned.replace(/-+/g, '-');

    return cleaned;
}

export function phoneDigitsOnly(input: string) {
    if (!input) return '';

    // Remove everything except numbers
    return input.replace(/[^0-9]/g, '');
}