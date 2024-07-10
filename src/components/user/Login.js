import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../store/auth-context';
import { KAKAO_AUTH_URL } from '../../config/Kakao-config';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PasswordResetModal from './PasswordResetModal';
import styles from '../../styles/user/Login.module.scss';
import CustomSnackBar from '../../common/layout/CustomSnackBar';

const { container, title, content, etcItem, signIn, findPassword } = styles;

const Login = () => {
  // http://localhost:8181/issue-trend/login
  const REQUEST_URL = BASE + USER + '/login';
  const { onLogin, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      // 스낵바 오픈
      setOpen(true);
      // 일정 시간 뒤 Todo 화면으로 redirect
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [isLoggedIn, navigate]);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    console.log('모달 열기');
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    console.log('모달 닫기');
    setIsModalOpen(false);
  };

  const [showPw, setShowPw] = useState(false);
  const handleToggleShowPw = () => {
    setShowPw((prevShowPw) => !prevShowPw);
  };

  const fetchLogin = async () => {
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');
    console.log($email.value, $password.value);
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        password: $password.value,
      }),
    });

    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }

    const {
      token,
      email,
      loginPath,
      profileImage,
      regionName,
      nickname,
      userNo,
      favoriteKeywords,
    } = await res.json();
    console.log('token:', token);
    console.log('email:', email);
    console.log('loginPath:', loginPath);
    console.log('profileImage:', profileImage);
    console.log('regionName:', regionName);
    console.log('nickname:', nickname);
    console.log('favoriteKeywords:', favoriteKeywords);
    onLogin(
      token,
      email,
      loginPath,
      profileImage,
      regionName,
      nickname,
      userNo,
      favoriteKeywords,
    );
    navigate('/home');
  };

  const loginHandler = (e) => {
    e.preventDefault();
    fetchLogin();
  };

  const initialFindEmailState = {
    email: '',
    error: '',
  };

  const [findPwValue, setFindPwValue] = useState(initialFindEmailState);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  const findPasswordEmailHandler = (e) => {
    const inputValue = e.target.value;
    let error = '';

    if (!inputValue) {
      error = '이메일은 필수값 입니다.';
    } else if (!emailRegex.test(inputValue)) {
      error = '이메일 형식이 올바르지 않습니다.';
    }

    setFindPwValue({
      email: inputValue,
      error,
    });

    setIsEmailValid(!error); // error가 비어있으면 true, 아니면 false
  };

  const isModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      {!isLoggedIn && (
        <div className={container}>
          <Container
            component='main'
            maxWidth='xs'
            style={{ backgroundColor: 'wheat', padding: '20px' }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={title}>로그인</div>
                <div className={content}>
                  이 서비스를 이용하시려면 로그인이 필요합니다. <br></br>회원이
                  아닌 분은 먼저 회원가입을 해주시기 바랍니다.
                </div>
              </Grid>
            </Grid>
            <form noValidate onSubmit={loginHandler}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='email'
                    label='이메일'
                    name='email'
                    autoComplete='email'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    label='비밀번호'
                    required
                    fullWidth
                    id='password'
                    name='password'
                    autoComplete='current-password'
                    type={showPw ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleToggleShowPw} edge='end'>
                            {showPw ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    color='primary'
                    style={{
                      padding: '4% 0',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    로그인
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <a href={KAKAO_AUTH_URL}>
                    <img
                      style={{ width: '100%' }}
                      alt='kakaobtn'
                      src={require('../../assets/img/kakao_login_medium_wide.png')}
                    />
                  </a>
                </Grid>
                <Grid container className={etcItem}>
                  <Grid item xs={6} className={signIn}>
                    <Link to='/join'>회원가입</Link>
                  </Grid>
                  <Grid item xs={6} className={findPassword}>
                    <MuiLink
                      href='#'
                      onClick={handleOpenModal}
                      underline='hover'
                    >
                      비밀번호 찾기
                    </MuiLink>
                  </Grid>
                </Grid>
              </Grid>
            </form>
            <PasswordResetModal
              isModalOpen={isModalOpen}
              isModalClose={isModalClose}
            />
          </Container>
        </div>
      )}
      <CustomSnackBar open={open} />
    </div>
  );
};

export default Login;
