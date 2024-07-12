import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DASHBOARD, SIGNIN, SIGNUP } from '../utils/routes';
import { useForm } from "react-hook-form";
import { passwordRegx, toast } from '../utils/constants';
import { USER_REGISTRATION, USER_LOGIN } from '../utils/actionURLs';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const Registration = ({ authType = "login" }) => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const actionURL = authType === "login" ? USER_LOGIN : USER_REGISTRATION;
  const navigateText = authType === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign in";
  const navigateURL = authType === "login" ? SIGNUP : SIGNIN;


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(actionURL, data);
      if (response.data.success) {
        const { access_token, user } = response.data.data;
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
          <img src='./logo517.png' height={'150px'} />
          <Typography component="h1" variant="h5">
            {authType === "login" ? "Sign in" : "Sign up"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email_id"
                  label="Email Address"
                  name="email_id"
                  autoComplete="email"
                  {...register("email_id", {
                    required: 'Email Id is required.',
                    maxLength: {
                      value: 100,
                      message: 'Email Id should be at most 100 characters.',
                    },
                    minLength: {
                      value: 12,
                      message: 'Email Id should be at least 12 characters.',
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
                  autoComplete="new-password"
                  {...register("password", {
                    required: 'Password is required.',
                    pattern: {
                      value: passwordRegx,
                      message: 'Password must have one letter, one number and one special character.',
                    },
                    maxLength: {
                      value: 24,
                      message: 'Password should be at most 24 characters.',
                    },
                    minLength: {
                      value: 8,
                      message: 'Password should be at least 8 characters.',
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
              sx={{ mt: 2, mb: 2 }}
            >
              {authType === "login" ? "Sign in" : "Sign up"}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href={navigateURL} variant="body2">
                  {navigateText}
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