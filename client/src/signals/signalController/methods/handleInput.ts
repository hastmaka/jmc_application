import _ from "lodash";

/**
 * * Handles input changes for form fields, updating the form data and error states accordingly.
 *  *
 *  * @param {string} type - The category or section of the form (e.g., "user", "address").
 *  * @param {string} name - The specific field name within the form section.
 *  * @param {*} value - The new value to assign to the form field.
 *  * @param {boolean} [api] - Optional flag indicating if the value is coming from an API response.
 *  *
 *  * This function performs the following operations:
 *  * - Validates that both `type` and `name` are provided.
 *  * - Initializes error tracking for the given type if not already present.
 *  * - Handles appending values to arrays when the `api` flag is true.
 *  * - Removes error entries for the field if a new valid value is provided.
 *  * - Updates the form data with the new value.
 *  * - Updates the dirty fields state by comparing current and previous form data.
 *  * - Sets a flag indicating whether the form is dirty (has unsaved changes).
 */

export function handleInput(
    this: any,
    type: string,
    name: string,
    value: any,
    api?: boolean
): void {
    if (!type || !name) throw new Error('type and name are required');

    if (!this.errors[type]) this.errors[type] = {};

    let tempValue = value;

    if (api) {
        const isArr = _.isArray(value);
        const current = this.formData?.[type]?.[name];
        if (!current) {
            tempValue = !isArr ? [value] : value;
        } else {
            tempValue = _.isArray(current) ? [...current, value] : [value];
        }
    }

    if (this.errors[type]?.[name] && value) {
        delete this.errors[type][name];
    }

    if (!this.formData[type]) this.formData[type] = {};
    this.formData[type][name] = tempValue;
    if(import.meta.env.DEV) console.log(this.formData);
    /** we check in real time if some field from the formData[key] change*/
    if (this.formDataCopy) {
        this.dirtyFields = this.checkFormValues(
            this.formDataCopy,
            this.formData[type]
        ).differences;
        this.isFormDirty = Object.keys(this?.dirtyFields).length > 0
    }
}