import React, { useState } from 'react';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Input,
    Button,
    ButtonType,
    Section,
    SectionTheme,
    SectionAlignment,
    SectionLayoutType,
    Spin,
    ScrollBar,
    SectionHeader,
    SectionHeaderTitle,
    SectionBody,
    SectionFooter,
    NumberInput,
} from 'react-fully';
import {
    IForm,
    Form,
    useForm,
    FormAction,
    FormField,
    toArrayPropertyIndexedName,
} from 'react-hook-form-controlled';
import './App.scss';
import { Table } from 'antd';

export function App() {
    const [name, setName] = useState<string>('');
    const form = useForm({
        defaultValues: {},
        validationSchema: undefined,
        onSubmit: (values: any, form: IForm) => {
            alert(JSON.stringify(values, null, 4));
        },
        onReset: (values: any, form: IForm) => {},
        handlers: [],
    });
    const addresses = form.useFieldArray('addresses');
    return (
        <div className="app">
            <Form form={form}>
                <Section theme={SectionTheme.White}>
                    <SectionHeader>
                        <Section align={SectionAlignment.Left}>
                            <SectionHeaderTitle
                                startIcon={
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                    ></FontAwesomeIcon>
                                }
                            >
                                {'Add New'}
                            </SectionHeaderTitle>
                        </Section>
                    </SectionHeader>
                    <Spin spinning={false}>
                        <SectionBody padding>
                            <ScrollBar autoHeightMax={'calc(100vh - 17.5em)'}>
                                <FormField
                                    name="firstName"
                                    label={'First Name'}
                                >
                                    <Input />
                                </FormField>
                                <FormField name="lastName" label={'Last Name'}>
                                    <Input />
                                </FormField>
                                <FormField
                                    name="addresses"
                                    label={'Addresses'}
                                    hasChild={true}
                                >
                                    <Button
                                        onClick={() => {
                                            addresses.append({});
                                        }}
                                    >
                                        New
                                    </Button>
                                    <Table
                                        dataSource={addresses.values}
                                        columns={[
                                            {
                                                dataIndex: 'address',
                                                title: 'Address',
                                                render: (
                                                    value: any,
                                                    record: any,
                                                    index: number,
                                                ) => {
                                                    return (
                                                        <FormField
                                                            name={toArrayPropertyIndexedName(
                                                                'addresses',
                                                                index,
                                                                'address',
                                                            )}
                                                            label="Address"
                                                        >
                                                            <Input />
                                                        </FormField>
                                                    );
                                                },
                                            },
                                        ]}
                                    />
                                </FormField>
                            </ScrollBar>
                        </SectionBody>
                        <SectionFooter>
                            <Section
                                layout={SectionLayoutType.Horizontal}
                                align={SectionAlignment.Center}
                                autoSpacing={true}
                            >
                                <FormAction>
                                    <Button
                                        startIcon={
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                            ></FontAwesomeIcon>
                                        }
                                        type={ButtonType.Primary}
                                        onClick={() => {
                                            form.submitForm();
                                        }}
                                    >
                                        {'Add'}
                                    </Button>
                                </FormAction>
                                <FormAction>
                                    <Button
                                        type={ButtonType.Secondary}
                                        onClick={() => {
                                            form.resetForm();
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </FormAction>
                                <FormAction>
                                    <Button
                                        type={ButtonType.Secondary}
                                        onClick={() => {}}
                                    >
                                        Cancel
                                    </Button>
                                </FormAction>
                            </Section>
                        </SectionFooter>
                    </Spin>
                </Section>
            </Form>
        </div>
    );
}
