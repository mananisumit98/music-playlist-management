import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from 'axios';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DASHBOARD, SIGNUP } from '../utils/routes';
import { useForm } from "react-hook-form";
import { passwordRegx, toast } from '../utils/constants';
import { USER_LOGIN } from '../utils/actionURLs';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const Login = () => {

    const { register, handleSubmit, formState: { errors }, } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(USER_LOGIN, { "email_id": data.email_id, "password": data.password });

            if (response.data.success) {
                const responseData = response?.data?.data;
                const { access_token, user } = responseData;
                if (user) {
                    delete user.password;
                }
                localStorage.setItem("user_token", access_token);
                localStorage.setItem("user", JSON.stringify(user));
                navigate(DASHBOARD);
                toast(response.data.message, "success");
            } else {
                toast(response.data.message, "error");
            }
        } catch (error) {
            console.log("error ::", error);
            toast(error.message, "error");
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    {...register("email_id", {
                                        required: 'User name is required.',
                                        maxLength: {
                                            value: 20,
                                            message: 'User name should be at most 20 characters.',
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'User name should be at least 2 characters.',
                                        },
                                    })}
                                />
                                <Typography component="h1" variant="h5">
                                    {errors?.email_id?.type === 'required' && <span className="errormsg">{errors.email_id.message}</span>}
                                    {errors?.email_id?.type === 'minLength' && <span className="errormsg">{errors.email_id.message}</span>}
                                    {errors?.email_id?.type === 'maxLength' && <span className="errormsg">{errors.email_id.message}</span>}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    {...register("password", {
                                        required: 'Password is required.',
                                        pattern: {
                                            value: passwordRegx,
                                            message: 'Password must have one letter, one number and one special character.',
                                        },
                                        maxLength: {
                                            value: 12,
                                            message: 'Password should be at most 12 characters.',
                                        },
                                        minLength: {
                                            value: 6,
                                            message: 'Password should be at least 6 characters.',
                                        },
                                    })}
                                />
                                <Typography component="h1" variant="h5">
                                    {errors?.password?.type === 'required' && <span className="errormsg">{errors.password.message}</span>}
                                    {errors?.password?.type === 'pattern' && <span className="errormsg">{errors.password.message}</span>}
                                    {errors?.password?.type === 'minLength' && <span className="errormsg">{errors.password.message}</span>}
                                    {errors?.password?.type === 'maxLength' && <span className="errormsg">{errors.password.message}</span>}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 1, mb: 0 }}
                                >
                                    Sign In
                                </Button>
                            </Grid>
                            <Grid item xs={12} container justifyContent="center">
                                <Link href={SIGNUP} variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;