import { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form/dist/types';
import { IForm, IFormUseFieldArrayMethods } from '../form';

export const useFieldArray = (
    form: IForm,
    name: string,
    keyName?: string,
): IFormUseFieldArrayMethods => {
    const defaultValues = [
        {
            color: 50,
            size: 50,
        },
    ];
    const [values, setValues] = useState<FieldValues[]>([]);

    const getRootName = () => {
        const matchingFieldRefs = Object.keys(form.control.fieldsRef.current)
            .sort(function (a, b) {
                // sort high to low string length
                return b.length - a.length;
            })
            .filter((x) => new RegExp('.' + name + '$').test(x))
            .map((x) => x.split(new RegExp('.' + name + '$')));
        if (matchingFieldRefs.length > 0) {
            matchingFieldRefs[0][0];
        }
        return name;
    };

    const getFieldRefs = () => {
        return Object.keys(form.control.fieldsRef.current).filter((x) =>
            new RegExp('^' + getRootName() + '').test(x),
        );
    };

    const unregisterFieldRefs = () => {
        const fieldRefs = getFieldRefs();
        fieldRefs.forEach((name) => {
            form.unregister(name);
        });
    };

    const registerFieldRefs = () => {
        values.forEach((value, index: number) => {
            for (const key in value) {
                const fieldName = toArrayPropertyIndexedName(
                    getRootName(),
                    index,
                    key,
                );
                form.register({ name: fieldName });
            }
        });
    };

    const swapArray = (arr: any[], indexA: number, indexB: number) => {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
        return arr;
    };

    const moveArray = (arr: any[], indexA: number, indexB: number) => {
        if (indexB >= arr.length) {
            var k = indexB - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(indexB, 0, arr.splice(indexA, 1)[0]);
        return arr;
    };

    useEffect(() => {
        form.setValue(getRootName(), values, {
            shouldValidate: true,
        });
        registerFieldRefs();
    }, [values]);

    useEffect(() => {
        if (Array.isArray(form.getValues(name))) {
            setValues(form.getValues(name));
        }
    }, [form.getValues(name)]);

    return {
        values: values,
        setValues: setValues,
        prepend: (
            value: Partial<FieldValues> | Partial<FieldValues>[],
            shouldFocus?: boolean,
        ) => {
            const newValues = Array.isArray(value) ? value : [value];
            setValues([...newValues, ...values]);
        },
        append: (
            value: Partial<FieldValues> | Partial<FieldValues>[],
            shouldFocus?: boolean,
        ) => {
            const newValues = Array.isArray(value) ? value : [value];
            setValues([...values, ...newValues]);
        },
        insert: (
            index: number,
            value: Partial<FieldValues> | Partial<FieldValues>[],
            shouldFocus?: boolean,
        ) => {
            const newValues = Array.isArray(value) ? value : [value];
            const insertedNewValues = [...values];
            insertedNewValues.splice(index, 0, newValues);
            setValues(insertedNewValues);
        },
        remove: (index?: number | number[]) => {
            const indexes = Array.isArray(index) ? index : [index];
            const newValues = values.filter(
                (x, i) => indexes.find((_x, _i) => _i == i) === undefined,
            );
            unregisterFieldRefs();
            setValues([...newValues]);
        },
        move: (indexA: number, indexB: number) => {
            const newValues = moveArray([...values], indexA, indexB);
            setValues([...newValues]);
        },
        swap: (indexA: number, indexB: number) => {
            const newValues = swapArray([...values], indexA, indexB);
            setValues([...newValues]);
        },
    };
};

export const toArrayPropertyIndexedName = (
    arrayName: string,
    index: number,
    propertyName: string,
) => {
    return `${arrayName}[${index}].${propertyName}`;
};
