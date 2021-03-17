import { IFormFieldConfig } from '../../form-field.handlers';
import { FormFieldCacheLocalStorageProvider } from './provider/form-field-cache-local-storage-provider';

export enum FormFieldCacheProviderType {
    LocalStorage = 'LocalStorage',
}

export interface IFormFieldCacheConfig extends IFormFieldConfig {
    type: FormFieldCacheProviderType;
    max: number;
}

export class FormFieldCacheHandler {
    config: IFormFieldCacheConfig;

    constructor(config: IFormFieldCacheConfig) {
        this.config = {
            ...config,
            provider: this.getFormCacheProvider(config.type),
            max: config.max || 10,
        };
    }

    getValues = (name: string) => {
        return this.get(name);
    };

    setValues = (name: string, value: any) => {
        if (value) {
            this.set(name, value);
        }
    };

    get = (key: string) => {
        return this.config.provider.get(key);
    };

    set = (key: string, value: any) => {
        if (value) {
            this.config.provider.set(key, value, this.config.max);
        }
    };

    getFormCacheProvider = (value: any) => {
        value = value || FormFieldCacheProviderType.LocalStorage;
        switch (value) {
            case FormFieldCacheProviderType.LocalStorage:
                return new FormFieldCacheLocalStorageProvider();
        }
    };
}
