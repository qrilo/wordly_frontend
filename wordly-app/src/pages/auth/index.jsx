import React, { useState } from 'react';
import SignIn from '../../components/auth/sign-in';
import SignUp from '../../components/auth/sign-up';
import styles from './auth.module.scss';
import Header from '../../components/header';

const AuthPage = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };


    return (
        <div className={styles.auth__container}>
            <div className={styles.auth__component}>
                {isSignIn ? <SignIn changeForm={toggleForm} /> : <SignUp changeForm={toggleForm} />}
            </div>
        </div>
    );
};

export default AuthPage;