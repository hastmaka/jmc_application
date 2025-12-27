export const sanitizeObj = (obj) => {
    /**
     * Remove empty, null, undefined, and '' values from an object
     * @param  {Object} obj - The object to sanitize
     * @param  {Boolean} isSignal - If the object is a signal object, if true will clone into a regular object
     * @returns {Object} - The sanitized object
     **/

    return Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(obj).filter(([_, value]) => ![undefined, null, '', NaN].includes(value))
    );
};