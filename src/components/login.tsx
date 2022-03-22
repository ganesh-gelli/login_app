import { Grid, Box, Typography, Button, Input } from "@mui/material";
import axios from "axios";
import { useState, MouseEvent, ChangeEvent } from 'react';

export const LogIn = () => {
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState('');
  const [state, setState] = useState('login');
  const [loginSuccess, setSuccess] = useState<any>({});
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleOtpChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };
  const handleClick = (event: MouseEvent) => {
    console.log('Submit button clicked!');
    if (state === 'login' || state === 'forbidden') {
      console.log(inputValue);
      Login();
    } else if (state === 'otp') {
      console.log(inputValue);
      console.log(otp);
      OTP();
    } else if (state === 'success') {
      Logout()
    }
  };
  function Login() {
    const url = "http://localhost:8082/api/v1/auth/login";
    axios.post(url, { "email": inputValue }).then(function (response) {
      if (response) {
        console.log(response);
      }
      setState("otp");
    }).catch(function (error) {
      console.error(error);
      setState("forbidden")
    });
  }
  async function OTP() {
    const url = "http://localhost:8082/api/v1/auth/opt-validation";
    await axios.post(url, { "email": inputValue, "otp": otp }).then(function (response) {
      if (response) {
        console.log(response);
        setSuccess(response.data.data);
      }
      setState("success");
    }).catch(function (error) {
      console.error(error);
      setState("forbidden")
    });
  }
  async function forceLogout() {
    const url = "http://localhost:8082/api/v1/auth/force-logout/" + inputValue;
    await axios.get(url).then(function (response) {
      if (response) {
        console.log(response);
        setSuccess(response.data);
      }
      setState("login");
    }).catch(function (error) {

    });
  }
  async function Logout() {
    const url = "http://localhost:8082/api/v1/auth/logout";
    await axios.get(url, {
      headers: {
        'Authorization': `${loginSuccess.token}`
      }
    }).then(function (response) {
      if (response) {
        console.log(response);
        setSuccess(response.data);
      }
      setState("login");
    }).catch(function (error) {

    });
  }
  return (
    <Grid justifyContent='center' item container>
      {state === 'forbidden' &&
        <Box width='400px' alignItems='center' mt='10%' component="form">

          <Box textAlign='center' mt='10%'>
            <Typography fontSize="14px" textAlign='center' fontWeight='bold'>
              User Logged In with same email click to logout
            </Typography>
            <Button variant='contained' type="button" onClick={() => forceLogout()}>logout user</Button>
          </Box>

        </Box>
      }
      {(state === 'login' || state === 'forbidden') &&
        <Box width='400px' alignItems='center' mt='10%' component="form">
          <Typography fontSize="14px" textAlign='center' fontWeight='bold'>
            please enter your email
          </Typography>
          <Box mt='1%'><Input
            size="small"
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            placeholder="eg:example@gmail.com"
            sx={{ mt: 1, mb: 1 }}
            onChange={handleInputChange}
          /></Box>
          <Box textAlign='center' mt='10%'>
            <Button variant='contained' type="button" onClick={handleClick}>Login</Button>
          </Box>

        </Box>
      }
      {state === 'otp' &&
        <Box width='400px' alignItems='center' mt='10%' component="form">
          <Typography fontSize="14px" textAlign='center' fontWeight='bold'>
            Please Enter OTP
          </Typography>
          <Box mt='1%'><Input
            size="small"
            fullWidth
            id="otp"
            name="otp"
            autoComplete="otp"
            autoFocus
            placeholder="eg:1234"
            sx={{ mt: 1, mb: 1 }}
            onChange={handleOtpChange}
          /></Box>
          <Box textAlign='center' mt='10%'>
            <Button variant='contained' type="button" onClick={handleClick}>Verify</Button>
          </Box>

        </Box>}
      {state === 'success' &&
        <Box width='400px' alignItems='center' mt='10%'>
          <Typography fontSize="23px" textAlign='center' fontWeight='bold'>
            Thank you for logging in {loginSuccess.userEmail}
          </Typography>
          <Box mt="5%"><Button variant='contained' type="button" onClick={handleClick}>Logout</Button></Box>
        </Box>}
    </Grid>
  );
};
