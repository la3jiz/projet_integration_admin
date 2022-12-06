import { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'
// @mui
import {  Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { useHttpHook } from '../../../hooks/use-http';
import { AuthContext } from '../../../contexts/auth-context';
import Loader from '../../../UI/components/loaders/Loader';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const [ username,setUsername ]=useState('')
  const [ password,setPassword ]=useState('')
const { sendRequest,isLoading }=useHttpHook()
  const [showPassword, setShowPassword] = useState(false);
const {login}=useContext(AuthContext)
const handleUsernameChange=(event)=>{
  setUsername(event.target.value)

}

const handlePasswordChange=(event)=>{
  setPassword(event.target.value)



}

  const handleSubmit = async(event) => {
    event.preventDefault()
    try{
      const response =await sendRequest("http://localhost:8881/users/login",'POST',{
        username,
        password,
      });      
      const responseToken=response.headers.authorization;
      const decodedToken=jwtDecode(responseToken)
      const arrayResponse=response.data.split(' ')
      if(decodedToken.roles[0]==="ADMIN"){
        login(arrayResponse[1],arrayResponse[0],arrayResponse[2]);
      }else {
        throw new Error("you are not authorized, only admin can get access !!");
      }
    }catch(err){
console.log(err)
    }
 
  };

  return (
    <>
    <form onSubmit={handleSubmit} >
    {isLoading && <Loader/>}
      <Stack spacing={3}>
        <TextField 
        name="username" 
        label="Username"
        autoComplete='off'
        onChange={handleUsernameChange}
        required
         />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{my:4}}>
        Login
      </LoadingButton>
      </form>
    </>
  );
}
