import { useEffect, CSSProperties } from 'react';
import { useForm as useReactHookForm, FormProvider } from 'react-hook-form';
import {
    ArrayField,
    FieldValues,
    Mode,
    UseFieldArrayMethods,
    UseFormMethods,
} from 'react-hook-form/dist/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { byString } from 'lib/util/js-helper';
import { useFieldArray } from './field-array/field-array';
import { IFormHandler, FormHandler } from './form.handler';

export interface IFormConfiguration {
    defaultValues: any;
    validationSchema: any;
    queryParams?: any;
    cacheRequest?: any;
    onSubmit: (values: any, form: IForm) => void;
    onReset: (values: any, form: IForm) => void;
    mode?: Mode;
    reValidateMode?: Exclude<Mode, 'onTouched' | 'all'>;
    handlers?: IFormHandler[];
}

export interface IFormUseFieldArrayMethods
    extends Omit<UseFieldArrayMethods, 'fields'> {
    values: Partial<ArrayField<FieldValues, string>>[];
    setValues: (fields: Partial<ArrayField<FieldValues, string>>[]) => void;
}

export interface IForm extends UseFormMethods {
    defaultValues: any;
    validationSchema: any;
    formHandlers: IFormHandler;
    submitForm: () => void;
    resetForm: () => void;
    resetFormArray: (values: any) => void;
    handlers?: IFormHandler[];
    setValues: (values: any, config?: any) => void;
    useFieldArray: (
        name: string,
        keyName?: string,
    ) => IFormUseFieldArrayMethods;
}

export const useForm = (formConfiguration: IFormConfiguration): IForm => {
    const formHandler = new FormHandler(
        Array.isArray(formConfiguration.handlers)
            ? formConfiguration.handlers
            : [],
    );
    formConfiguration.defaultValues = formHandler.onInitializing(
        formConfiguration.defaultValues,
    );

    const reactHookForm = useReactHookForm({
        defaultValues: formConfiguration.defaultValues,
        resolver: formConfiguration.validationSchema
            ? yupResolver(formConfiguration.validationSchema)
            : undefined,
        mode: formConfiguration.mode || 'onChange',
        reValidateMode: formConfiguration.reValidateMode || 'onChange',
    });

    // need to define as get Values does not work in case of
    // some object like mobx
    const getValues = (name?: string | undefined): any | FieldValues[] => {
        const values = reactHookForm.getValues();
        return name ? byString(values, name) : values;
    };

    const form = {
        ...reactHookForm,
        getValues: getValues,
        defaultValues: formConfiguration.defaultValues || {},
        validationSchema: formConfiguration.validationSchema,
        handlers: formConfiguration.handlers,
    } as IForm;

    form.submitForm = () => {
        form.handleSubmit(
            (values: any, e: any) => {
                values = formHandler.onSubmitting(values, form);
                if (formConfiguration.onSubmit) {
                    formConfiguration.onSubmit(values, form);
                }
            },
            (errors: any, e: any) => console.error(errors, e),
        )();
    };

    const reset = (values: any) => {
        reactHookForm.reset(values);
        values = formHandler.onResetting(values, reactHookForm);
        if (formConfiguration.onReset) {
            formConfiguration.onReset(values, form);
        }
    };

    form.resetForm = () => {
        reset(formConfiguration.defaultValues);
    };

    form.resetFormArray = (values: any) => {
        reset(values);
    };

    form.setValues = (values: any, config: any) => {
        for (const key in values) {
            form.setValue(key, values[key], config);
        }
    };

    form.useFieldArray = (
        name: string,
        keyName?: string,
    ): IFormUseFieldArrayMethods => {
        return useFieldArray(form, name, keyName);
    };

    return form;
};

interface IFormProps {
    form: IForm;
    style?: CSSProperties;
    children?: any;
}

export const Form = ({ form, style, children }: IFormProps) => {
    if (form == null) {
        throw new Error('Please provide form');
    }

    /** register fields from default values if it's not already present */
    const registerNonControlFields = () => {
        const fields = form.control.fieldsRef.current;
        for (const key in form.defaultValues) {
            if (!fields[key]) {
                form.register({ name: key });
            }
        }
    };

    const setValue = form.setValue;
    form.setValue = (name: string, value: any, config: any) => {
        /** register field if it's not already present */
        const fields = form.control.fieldsRef.current;
        if (!fields[name]) {
            form.register({ name: name });
        }
        /** end */

        config = config || {};
        setValue(name, value, {
            shouldValidate: config.shouldValidate || true,
        });
    };

    useEffect(() => {
        const onReady = async () => {
            await form.formHandlers.onReady(form.defaultValues, form);
        };
        onReady();
        // registerNonControlFields();

        // To Clear errors at start of new form due to form-field's setInputValue for default values
        // TODO [NS]: cross check if it should not be causing issues to set default values
        form.resetForm();
    }, []);

    return (
        <div className="form" style={style}>
            <FormProvider {...form}>
                <form autoComplete="nope" onSubmit={form.submitForm}>
                    {children}
                </form>
            </FormProvider>
        </div>
    );
};
