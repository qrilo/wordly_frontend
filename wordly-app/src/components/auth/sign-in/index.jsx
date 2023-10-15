import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Formik, Form, Field } from 'formik';
import styles from '../auth-form.module.scss';
import { Message } from 'primereact/message';
import authService from '../../../services/authService';
import { Messages } from 'primereact/messages';

const SignIn = ({ changeForm }) => {
    const [loading, setLoading] = useState(false);
    const errorMessages = useRef(null);

    const initialValues = {
        email: '',
        password: '',
    };


    const clearErrorMessages = () => {
        errorMessages.current.clear();
    }

    const handleSubmit = async (values) => {
        clearErrorMessages();
        setLoading(prev => !prev);
        const response = await authService.signIn(values);
        if (response.isSuccessed) {
            window.location.reload();
        }
        if (response.isBadRequest) {
            errorMessages.current.show(response.errors.map(error => {
                return { sticky: true, severity: 'error', summary: 'Error', detail: error.messages, closable: false }
            }));
            setLoading(prev => !prev);
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Email can\'t be empty';
        }
        if (!values.password) {
            errors.password = 'Password can\'t be empty';
        }
        return errors;
    };

    return (
        <div className={styles.container}>
            <h2>Sign In</h2>
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
                            <Field type="password" id="password" name="password" as={InputText} placeholder="Password" />
                            {errors.password && touched.password ? <div className={styles.error__container}><Message severity="error" text={errors.password} /> </div> : <div className={styles.error_block}></div>}
                        </div>
                        <div className={styles.input__fields}>
                            <p>Don't have an account yet? <a className={styles.link} onClick={changeForm}> Sign up now</a></p>
                        </div>
                        <Messages ref={errorMessages} />

                        <div className={styles.button__container}>
                            <Button label="Sign In" type="submit" loading={loading} />
                        </div>
                    </Form>
                )}
            </Formik>

        </div>
    );
};

export default SignIn;