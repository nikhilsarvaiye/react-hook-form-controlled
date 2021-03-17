import { IFormFieldCacheConfig } from '../form-field-cache.handler';

export class FormFieldCacheLocalStorageProvider {
    constructor(config?: IFormFieldCacheConfig) {}

    get = (key: string) => {
        const values = localStorage.getItem(key);
        return values ? JSON.parse(values) : [];
    };

    set = (key: string, value: any, max: number) => {
        let values = this.get(key) || [];
        while (values.length >= max) {
            values.pop();
        }
        if (values.indexOf(value) > -1) {
            values.splice(values.indexOf(value), 1);
        }
        values = [value, ...values];
        localStorage.setItem(key, JSON.stringify(values));
    };
}
