"use client"
import { useState } from 'react';
import axios from 'axios';

import z from 'zod';
import { useRouter } from 'next/navigation';

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");


export default function SignInPage() {

  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);




  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const validatePassword = () => {
    const result = passwordSchema.safeParse(password)
    const error = result.error?.issues[0]?.message || 'Invalid password';
    if (!result.success) {
      setPasswordError(error);
      return false;
    }
    return true;

  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validatePassword()) {
      axios.post('/api/auth/signup', {
        email,
        password
      })
        .then((response) => {
          if (response.status === 200) {
            alert(response.status)
            console.log(response.data)

            router.push('/signin');

            localStorage.setItem('user', JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.error('Error logging in', error);
        });
    };
  }
  return (
    <div>
      <style>
        {`
          input:focus {outline: none;}
        `}
      </style>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 items-center mx-auto size-[404px] h-[636px] '>
        <div className='w-[274px] h-7 mt-4 flex items-center justify-center'> <p className='font-bold text-2xl leading-(125%) tracking-[0.2px] text-custom-grey-900'>
          Sign Up
        </p>
        </div>
        <div className='flex flex-col items-start p-0 gap-4 w-[404px] h-[200px]'>

          <div className='flex items-center gap-3 px-2 py-4 w-[404px] h-[56px] rounded-xl border border-custom-grey-200 self-stretch'>
            {/* <img src='/src/assets/user.png' className='w-6 h-6' alt='user' /> */}
            <input
              style={{ outline: 'none' }}
              type='text'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(email);
                setEmail(e.target.value);
              }}
              className=' w-full'
              placeholder='Username or Email'
            />

          </div>
          <div className=' box-border flex items-center gap-3 px-2 py-4 w-[404px] h-[56px] rounded-xl border border-custom-grey-200 self-stretch'>
            {/* <img src='/src/assets/Group.svg' className='w-6 h-6' alt='user' /> */}

            <input type={showPassword ? 'text' : 'password'}
              className='w-full'


              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={toggleShowPassword} className='w-6 h-7 pr-1' >👁️</button>

          </div>
          {passwordError && <p className='text-red-500'>{passwordError}</p>}
          <p className='font-normal text-[12px] leading-[160%] text-custom-grey-500'>
            Your password must have at least 8 characters
          </p>
          <button
            type="submit"
            className='flex justify-center items-center p-2 gap-2 w-[404px] h-[56px] bg-blue-600 rounded-2xl cursor-pointer'
          >
            <p className='w-16 h-5 font-bold text-[16px] leading-[140%] tracking-[0.2px] text-white'>Sign Up</p>
          </button>
        </div>
      </form></div>



  )
}