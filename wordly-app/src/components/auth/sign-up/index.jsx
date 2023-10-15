import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Formik, Form, Field } from 'formik';
import styles from '../auth-form.module.scss';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import authService from '../../../services/authService';
import { Messages } from 'primereact/messages';

const SignUp = ({ changeForm }) => {
    const errorMessages = useRef(null);
    const [loading, setLoading] = useState(false);

    const initialValues = {
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
    };

    const clearErrorMessages = () => {
        errorMessages.current.clear();
    }

    const handleSubmit = async (values) => {
        clearErrorMessages();
        setLoading(prev => !prev);
        const response = await authService.signUp(values);
        if (response.isSuccessed) {
            window.location.reload();
        }

        if (response.isBadRequest) {
            console.log(response.errors);
            errorMessages.current.show(response.errors.map(error => {
                return { sticky: true, severity: 'error', summary: 'Error', detail: `${error.property} ${error.messages}`, closable: false }
            }));
        }

        setLoading(prev => !prev);
    };

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Email can\'t be empty';
        }
        if (!values.name) {
            errors.name = 'Name can\'t be empty';
        }
        if (!values.password) {
            errors.password = 'Password can\'t be empty';
        }
        else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Password doesn\'t match';
        }
        return errors;
    };

    return (
        <div className={styles.container}>
            <h2>Sign Up</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validate={validate}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className={styles.input__fields}>
                            <Field type="email" id="email" name="email" as={InputText} placeholder="Email" />
                            {errors.email && touched.email ? <div className={styles.error__container}><Message severity="error" text={errors.email} /></div> : <div className={styles.error_block}></div>}
                        </div>
                        <div className={styles.input__fields}>
                            <Field type="text" id="name" name="name" as={InputText} placeholder="Name" />
                            {errors.name && touched.name ? <div className={styles.error__container}><Message severity="error" text={errors.name} /> </div> : <div className={styles.error_block}></div>}
                        </div>
                        <div className={styles.input__fields}>
                            <Field type="password" id="password" name="password" as={InputText} placeholder="Password" />
                            {errors.password && touched.password ? <div className={styles.error__container}><Message severity="error" text={errors.password} /> </div> : <div className={styles.error_block}></div>}
                        </div>
                        <div className={styles.input__fields}>
                            <Field type="password" id="confirmPassword" name="confirmPassword" as={InputText} placeholder="Confirm password" />
                            {errors.confirmPassword && touched.confirmPassword ? <div className={styles.error__container}><Message severity="error" text={errors.confirmPassword} /> </div> : <div className={styles.error_block}></div>}
                        </div>
                        <div className={styles.input__fields}>
                            <p>Already have an account? <a className={styles.link} onClick={changeForm}> Sign in now</a></p>
                        </div>
                        <Messages ref={errorMessages} />
                        <div className={styles.button__container}>
                            <Button label="Sign up" type="submit" loading={loading} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;