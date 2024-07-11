import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DASHBOARD, SIGNIN } from '../utils/routes';
import { useForm } from "react-hook-form";
import { passwordRegx, toast } from '../utils/constants';
import { USER_REGISTRATION } from '../utils/actionURLs';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();


const Registration = () => {

  const { register, handleSubmit, reset, formState: { errors }, } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(USER_REGISTRATION, data);
      console.log("response ::::", response.data);
      if (response.data.success) {
        const { access_token, user } = response.data.data
        if (user) {
          delete user.password;
        }
        localStorage.setItem("user_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        toast(response.data.message, "success");
        reset();
        navigate(DASHBOARD);
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email_id"
                  label="Email Address"
                  name="email_id"
                  autoComplete="email"
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
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href={SIGNIN} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Registration;