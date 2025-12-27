import _ from 'lodash';

export function resetState(
    this: any,
    delay: number = 200
    // root?: string
) {
    // this is to let the animation finish
    setTimeout(() => {
        if (this.reset) {
            Object.keys(this.reset).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    const original = this.reset[key];
                    this[key] = _.cloneDeep(original);
                }
            });
        }
        // if (root) {
        //     this.formData[root] = {};
        //     this.errors[root] = {};
        // } else {
        //     this.formData = {};
        //     this.errors = {};
        // }
        this.modal = {loading: false, state: 'create'}
        this.dirtyFields = {}
    }, delay);
}