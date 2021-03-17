import { FieldValues } from 'react-hook-form';
import { IForm } from './form';

export interface IFormHandler {
    onInitializing: (initialValues: FieldValues) => FieldValues;
    onReady: (initialValues: any, form: IForm) => void;
    onSubmitting: (values: any, form: IForm) => FieldValues;
    onResetting: (values: any, form: IForm) => FieldValues;
}

export class FormHandler implements IFormHandler {
    constructor(public handlers: IFormHandler[]) {
        this.handlers = handlers || [];
    }

    onInitializing = (initialValues: any) => {
        this.handlers.forEach((handler) => {
            initialValues = handler.onInitializing(initialValues);
        });
        return initialValues;
    };

    onReady = async (initialValues: any, form: any) => {
        // TODO [NS]: update with await Promise.all
        // this.handlers.forEach(handler => {
        //     handler.onReady(initialValues, form);
        // });
        if (this.handlers.length) {
            await this.handlers[0].onReady(initialValues, form);
        }
    };

    onSubmitting = (values: any, form: any) => {
        this.handlers.forEach((handler) => {
            values = handler.onSubmitting(values, form);
        });
        return values;
    };

    onResetting = (values: any, form: any) => {
        this.handlers.forEach((handler) => {
            if (handler.onResetting) {
                values = handler.onResetting(values, form);
            }
        });
        return values;
    };
}
