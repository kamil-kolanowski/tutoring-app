import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { db } from "../../functions/db";
import { useNavigate } from 'react-router';
import { setCookie } from "../../functions/cookies";
import styles from './AdminLogin.module.scss';
import bcrypt from 'bcryptjs';

export default function AdminLogin() {
    const navigate = useNavigate();

    const [errMsgs, setErrMsgs] = useState({ email: "", password: "" });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (email) => {
        setEmail(email);
        setErrMsgs({ email: "", password: "" });
    };

    const handlePasswordChange = (password) => {
        setPassword(password);
        setErrMsgs({ email: "", password: "" });
    };

    const handleLogin = async () => {
        const adminFetchedData = await db.company.where({ email: email }).toArray();

        if (adminFetchedData.length === 0) {
            setErrMsgs({ email: "Brak administratora o podanym mailu", password: "" });
            return;
        }

        const adminPassword = adminFetchedData[0].password;

        bcrypt.compare(password, adminPassword, (err, isMatch) => {
            if (err) {
                console.error(err);
            } else if (!isMatch) {
                setErrMsgs({ email: "", password: "Podano błędne hasło" });
            } else {
                setErrMsgs({ email: "", password: "" });
                setCookie("userData", JSON.stringify(adminFetchedData[0]), 7);
                setCookie("userType", "company", 7);
                navigate('/');
            }
        });
    };

    return (
        <div className={styles.container}>
            <Typography variant="h4" gutterBottom>Logowanie Administratora</Typography>
            <form className={styles.formElement}>
                <div className={styles.labelInputBox}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        error={Boolean(errMsgs.email)}
                        label="E-mail"
                        helperText={errMsgs.email}
                        onChange={(ev) => handleEmailChange(ev.target.value)}
                    />
                </div>
                <div className={styles.labelInputBox}>
                    <TextField
                        type="password"
                        variant="outlined"
                        fullWidth
                        error={Boolean(errMsgs.password)}
                        label="Hasło"
                        helperText={errMsgs.password}
                        onChange={(ev) => handlePasswordChange(ev.target.value)}
                    />
                </div>
                <Button variant="contained" onClick={handleLogin}>Zaloguj</Button>
            </form>
        </div>
    );
}
