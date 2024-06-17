import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { API_BASE_URL, USER } from '../../config/host-config';
import useGeolocation from 'react-hook-geolocation';
import styles from '../../styles/Join.module.scss';
import { AccessAlarm } from '@mui/icons-material';
import PinDropIcon from '@mui/icons-material/PinDrop';

const Join = () => {
  const [userValue, setUserValue] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });

  const [message, setMessage] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    phoneNumber: '',
    address: '',
  });

  const [correct, setCorrect] = useState({
    email: false,
    password: false,
    passwordCheck: false,
    phoneNumber: false,
    address: false,
  });

  const saveInputState = ({ key, inputValue, msg, flag }) => {
    inputValue !== 'pass' &&
      setUserValue((oldVal) => {
        return { ...oldVal, [key]: inputValue };
      });

    setMessage((oldMsg) => {
      return { ...oldMsg, [key]: msg };
    });

    setCorrect((oldCorrect) => {
      return { ...oldCorrect, [key]: flag };
    });
  };

  const fetchDuplicateCheck = (email) => {
    let msg = '';
    let flag = false;

    fetch(`${API_BASE_URL}${USER}/check?email=${email}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(`결과: ${result}`);

        if (result) {
          msg = '이메일이 중복되었습니다.';
        } else {
          msg = '사용 가능한 이메일 입니다.';
          flag = true;
        }
        saveInputState({ key: 'email', inputValue: email, msg, flag });
      });
  };

  const emailHandler = (e) => {
    const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    const inputValue = e.target.value;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '이메일은 필수값 입니다.';
    } else if (!emailRegex.test(inputValue)) {
      msg = '이메일 형식이 올바르지 않습니다.';
    } else {
      fetchDuplicateCheck(inputValue);
    }

    saveInputState({
      key: 'email',
      inputValue,
      msg,
      flag,
    });
  };

  const passwordHandler = (e) => {
    document.getElementById('password-check').value = '';
    setMessage({ ...message, passwordCheck: '' });
    setCorrect({ ...correct, passwordCheck: false });
    // 영문자 숫자 조합이 8자 이상
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const inputValue = e.target.value;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '비밀번호는 필수값 입니다.';
    } else if (!passwordRegex.test(inputValue)) {
      msg = '8글자 이상의 영문, 숫자를 포함해주세요.';
    } else {
      msg = '사용가능한 비밀번호 입니다.';
      flag = true;
    }

    saveInputState({ key: 'password', inputValue, msg, flag });
  };

  const pwCheckHandler = (e) => {
    let msg;
    let flag = false;

    if (!e.target.value) {
      msg = '비밀번호 확인란은 필수입니다.';
    } else if (userValue.password !== e.target.value) {
      msg = '입력한 비밀번호와 다릅니다.';
    } else {
      msg = '비밀번호가 일치합니다.';
      flag = true;
    }

    saveInputState({
      key: 'passwordCheck',
      inputValue: 'pass',
      msg,
      flag,
    });
  };

  // 핸드폰 번호
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneNumberHandler = (e) => {
    const phoneNumberRegex = /(01[016789{1}])-([0-9]{4})-([0-9]{4})$/;
    const inputValue = e.target.value;
    let filterPhoneNumber = '';

    let msg;
    let flag = false;
    filterPhoneNumber = inputValue
      .replace(/[^0-9.]/g, '')
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
      .replace(/(-{1,2})$/g, '');
    console.log(filterPhoneNumber);
    setPhoneNumber(filterPhoneNumber);

    if (!phoneNumberRegex.test(inputValue)) {
      msg = '휴대폰 번호를 다시 확인해주세요.';
    } else {
      flag = true;
    }

    saveInputState({
      key: 'phoneNumber',
      inputValue,
      msg,
      flag,
    });

    console.log({
      key: 'phoneNumber',
      inputValue,
      msg,
      flag,
    });
  };
  console.log(phoneNumber);

  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerOpen, setIstimerOpen] = useState(false);
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // 인증하기 버튼
  const sendButtonHandler = (e) => {
    e.preventDefault();
    setIstimerOpen(true);
    setRemainingTime(10);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isTimerOpen && remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else if (isTimerOpen && remainingTime === 0) {
        clearInterval(timer);
        alert('dd');
        setIstimerOpen(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  // 내 위치 자동설정
  const geolocation = useGeolocation();

  const addressClickHandler = (geolocation) => {
    console.log(geolocation);
  };

  const $fileTag = useRef();

  const isValid = () => {
    for (let key in correct) {
      const flag = correct[key];
      if (!flag) return false;
    }
    return true;
  };

  const fetchSignUpPost = () => {
    fetch(`${API_BASE_URL}${USER}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userValue),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`${data.email}님 회원가입에 성공했습니다.`);
      })
      .catch((err) => {
        console.log('err: ', err);
        alert('서버와의 통신이 원활하지 않습니다.');
      });
  };
  const joinButtonClickHandler = (e) => {
    e.preventDefault();

    if (isValid()) {
      fetchSignUpPost();
    } else {
      alert('입력란을 다시 확인해 주세요');
    }
  };

  console.log(correct.phoneNumber);

  return (
    <Container component='main' className={styles.main}>
      <Container component='div' className='main-inner'></Container>
      <Container
        className='main-inner'
        component='div' // Container가 HTML 태그중 main이 된다.
        // maxWidth='xs'를 바꿈
        style={{ margin: '0 auto' }}
      >
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component='h1' variant='h5'>
                회원가입
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div
                className='thumbnail-box'
                /* onClick={() => $fileTag.current.click() }*/ style={{
                  border: '1px solid black',
                }}
              >
                <img
                  src={require('../../assets/img/anonymous.jpg')}
                  alt='profile'
                />
                {/* require 앞에 imgFile 변수 넣어야 함 */}
              </div>
              <label className='signup-img-label' htmlFor='profile-img'>
                프로필 이미지 추가
              </label>
              <input
                id='profile-img'
                type='file'
                style={{ display: 'none' }}
                accept='image/*' /* 자사/소셜 로그인 진행시 DB에 넣을 때 경로문제 발생할 수도 있음 */
                ref={$fileTag}
                // onChange={showThumbnailHandler} 해야함
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete='fname'
                name='email'
                variant='outlined'
                required
                fullWidth
                id='email'
                label='이메일 주소'
                autoFocus
                onChange={emailHandler}
              />

              <span
                id='check-span'
                style={correct.email ? { color: 'green' } : { color: 'red' }}
              >
                {message.email}
              </span>
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='패스워드'
                autoComplete='current-password'
                onChange={passwordHandler}
              />
              <span
                id='check-span'
                style={correct.password ? { color: 'green' } : { color: 'red' }}
              >
                {message.password}
              </span>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password-check'
                label='패스워드 확인'
                type='password'
                id='password-check'
                autoComplete='check-password'
                onChange={pwCheckHandler}
              />
              <span
                id='check-span'
                style={
                  correct.passwordCheck ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.passwordCheck}
              </span>
            </Grid>

            <Grid item xs={9}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='phoneNumber'
                label='휴대폰 번호'
                id='phoneNumber'
                type='text'
                placeholder="휴대폰 번호 '-' 제외하고 입력"
                onChange={phoneNumberHandler}
                value={phoneNumber}
              />
              {isTimerOpen && (
                <span id='remain-time' style={{ color: 'red' }}>
                  {formatTime(remainingTime)}
                </span>
              )}
              <span
                id='check-span'
                style={
                  correct.phoneNumber ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.phoneNumber}
              </span>
            </Grid>
            <Grid item xs={3}>
              <Button
                type='button'
                fullWidth
                variant='contained'
                style={{ background: '#38d9a9' }}
                sx={{
                  height: '95%',
                }}
                startIcon={<AccessAlarm />}
                onClick={sendButtonHandler}
                disabled={!correct.phoneNumber}
              >
                인증하기
              </Button>
            </Grid>

            <Grid item xs={9}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='mobile-number-check'
                label='인증번호'
                type='tel'
                id='mobile-number-check'
              />
              {/* <span id='check-span'>{authNumTimer}</span> */}
            </Grid>
            <Grid item xs={3}>
              <Button
                type='button'
                fullWidth
                variant='contained'
                style={
                  { background: '#38d9a9' }
                  /* onclick={checkMobileNumberHandler} */
                }
                sx={{
                  height: '95%',
                }}
                // disabled={!correct.phoneNumber}
              >
                확인
              </Button>
            </Grid>

            <Grid item xs={9}>
              <TextField
                fullWidth
                // value={zonecode}  value라고 하면 안되나?
                id='zonecode'
                name='zonecode'
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                type='button'
                sx={{ height: '95%' }}
                style={{ background: '#38d9a9' }}
                fullWidth
                variant='contained'
                onClick={addressClickHandler}
                startIcon={<PinDropIcon />}
              >
                내 동네 설정
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type='button'
                fullWidth
                variant='contained'
                style={{ background: '#38d9a9', padding: '1.5%' }}
                onClick={joinButtonClickHandler}
              >
                회원가입
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Container>
  );
};
export default Join;
