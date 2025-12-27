import _ from 'lodash';

export function populateForm(
    this: any,
    type: string,
    fields: string[],
    data: Record<string, any>
) {
    const temp: Record<string, any> = {}
    _.each(fields, (key: string) => {
        if (!_.isNil(data[key])) {   // _.isNil checks for null or undefined
            temp[key] = data[key];
        }
    });

    const ids: Record<string, any> = {}
    Object.entries(data).forEach(([key, value]) => {
        if (/_id/.test(key) && typeof value === 'number') {   // _.isNil checks for null or undefined
            ids[key] = data[key];
        }
    });

    this.formData![type] = {...temp, ...ids}
    this['formDataCopy'] = _.cloneDeep(temp.toJSON?.() || temp);
    this.isFormDirty = false
    if (import.meta.env.DEV) console.log(this.formData![type])
}