import { IForm, IFormHandler } from 'react-hook-form-controlled';
import { FieldValues } from 'react-hook-form';

export class FormRequestCacheIdHandler implements IFormHandler {
    config: any;

    get url() {
        return window.location.href;
    }

    constructor(config: any) {
        if (!config.key) {
            throw new Error(
                'Please specify Url Request Parameter key for "cacheRequest" FormRequestCacheIdHandler',
            );
        }
        if (!config.service) {
            throw new Error(
                'Please specify Service for "cacheRequest" FormRequestCacheIdHandler',
            );
        }
        this.config = {
            urlUpdate: true,
            autoSubmit: true,
            service: config.service,
            getCacheIdKey: config.getCacheIdKey || 'getCacheId',
            setCacheIdKey: config.setCacheIdKey || 'cacheId',
            ...config,
        };
    }

    onInitializing = (initialValues: FieldValues) => {
        return {
            ...initialValues,
            ...this.getValues(),
        };
    };

    onReady = async (initialValues: FieldValues, form: IForm) => {
        if (this.config.autoSubmit) {
            const value = this.get(this.config.key);
            if (value) {
                const queryValues = await this.config.service.get(value);
                queryValues[this.config.getCacheIdKey] = value;
                // TODO [NS]: Find a awy better way to do this
                // Code review remove this
                if (queryValues && !queryValues.clientId) {
                    queryValues.clientId = 'all';
                }
                form.setValues({
                    ...queryValues,
                });
                form.submitForm();
            }
        }
    };

    onSubmitting = (values: FieldValues, form: IForm) => {
        return this.setValues(values);
    };

    onResetting = (values: FieldValues, form: IForm) => {
        const url = this.clearQueryStringValue(this.url);
        if (this.config.urlUpdate && decodeURI(url) !== decodeURI(this.url)) {
            this.updateUrl(url);
        }
        return values;
    };

    getValues = async () => {
        return {};
    };

    setValues = (values: any) => {
        let url;
        // for the first time if there is get cached id then just remove and do nothing
        if (values && values[this.config.getCacheIdKey]) {
            delete values[this.config.getCacheIdKey];
            delete values[this.config.setCacheIdKey];
            return values;
        }

        if (Object.keys(values).length) {
            const id = this.generateNewGuid();
            values[this.config.setCacheIdKey] = id;
            url = this.setQueryStringValue(id);
        } else {
            url = this.clearQueryStringValue(this.url);
        }
        if (this.config.urlUpdate && decodeURI(url) !== decodeURI(this.url)) {
            this.updateUrl(url);
        }

        return values;
    };

    getQueryStringValue = () => {
        return;
    };

    setQueryStringValue = (value: any) => {
        return this.set(this.config.key, value, this.url);
    };

    clearQueryStringValue = (url: string) => {
        return this.remove(this.config.key, url);
    };

    generateNewGuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            },
        );
    };

    get = (key: string, url?: string) => {
        url = url || window.location.href;
        key = key.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };

    set = (key: string, value: any, url: string) => {
        if (!url) url = '';
        var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        var separator = url ? (url.indexOf('?') !== -1 ? '&' : '?') : '';
        if (url.match(re)) {
            return url.replace(re, '$1' + key + '=' + value + '$2');
        } else {
            return url + separator + key + '=' + value;
        }
    };

    remove = (key: string, url: string) => {
        url = url.split('?')[0];
        let param,
            params_arr = [],
            queryString = url.indexOf('?') !== -1 ? url.split('?')[1] : '';
        if (queryString !== '') {
            params_arr = queryString.split('&');
            for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                param = params_arr[i].split('=')[0];
                if (param === key) {
                    params_arr.splice(i, 1);
                }
            }
            url = url + '?' + params_arr.join('&');
        }
        return url;
    };

    updateUrl(url: string, documentTitle?: string) {
        documentTitle = documentTitle ? documentTitle : document.title;
        var state = { Title: documentTitle, Url: url };
        window.history.pushState(state, state.Title, state.Url);
    }
}
