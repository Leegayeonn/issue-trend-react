import React, { useCallback, useContext, useRef, useState } from 'react';
import styles from '../../../styles/ChangeInfo.module.scss';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { API_BASE_URL, USER } from '../../../config/host-config';
import PinDropIcon from '@mui/icons-material/PinDrop';
import axiosInstance from '../../../config/axios-config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { debounce } from 'lodash';

const { kakao } = window;
const ChangeInfo = () => {
  const navigate = useNavigate();
  const { onLogout, profileImage } = useContext(AuthContext);

  const [currentKeywords, setCurrentKeywords] = useState(
    JSON.parse(localStorage.getItem('FAVORITE_KEYWORDS')),
  );

  const [isCheckPw, setIsCheckPw] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState({
    password: '',
    msg: '',
    flag: false,
  });

  const debounceCurrentPasswordHandler = useCallback(
    debounce((currentPassword) => {
      console.log('password debounce called! password: ', currentPassword);
      currentPasswordHandler(currentPassword);
    }, 500),
    [],
  );

  const currentPasswordHandler = async (currentPassword) => {
    console.log('내정보 변경전 입력한 패스워드 ', currentPassword);
    let flag = false;
    let msg;

    if (!currentPassword) {
      msg = '현재 비밀번호 입력은 필수 값입니다.';
    } else {
      flag = true;
    }
    setPasswordCheck({ password: currentPassword, flag, msg });
  };

  const sendCheckPwHandler = async () => {
    try {
      const res = await axiosInstance.post(
        `${API_BASE_URL}${USER}/password-check`,
        {
          password: passwordCheck.password,
        },
      );
      const status = res.status;
      const data = res.data;
      console.log('status: ', status);
      console.log('data: ', data);

      if (status === 200) {
        setIsCheckPw(true);
      }
    } catch (err) {
      console.log('err: ', err);
      alert(err.response.data);
    }
  };

  const currentPasswordOnKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      sendCheckPwHandler();
    }
  };

  // 내 정보 변경 페이지
  const [userValue, setUserValue] = useState({
    nickname1: localStorage.getItem('NICK_NAME'),
    password1: '',
    regionName1: localStorage.getItem('REGION_NAME'),
    favoriteKeywords1: JSON.parse(localStorage.getItem('FAVORITE_KEYWORDS')),
  });
  const { nickname1, password1, regionName1, favoriteKeywords1 } = userValue;
  console.log(nickname1, password1, regionName1, favoriteKeywords1);

  const [message, setMessage] = useState({
    nickname1: '',
    password1: '',
    passwordCheck1: '',
    regionName1: '',
  });

  const [correct, setCorrect] = useState({
    nickname1: false,
    password1: false,
    passwordCheck1: false,
    regionName1: false,
  });

  const debouncedNickChangeHandler = useCallback(
    debounce((nick) => {
      console.log('debounce called! nick: ', nick);
      nickChangeHandler(nick);
    }, 100),
    [],
  ); // 의존성 배열을 비워놓으면, 첫 렌더링 때 함수가 선언되고 다시는 재선언되지 않습니다.

  const saveInputState = ({ key, inputValue, msg, flag }) => {
    console.log('values: ', { key, inputValue, msg, flag });
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

  // 닉네임 변경
  const nickChangeHandler = async (nick) => {
    // 2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성
    const nickRegex = /^[a-zA-Z0-9가-힣]{2,16}$/;
    const inputValue = nick;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '공백으로 두면 기존 닉네임으로 유지됩니다.';
    } else if (!nickRegex.test(inputValue)) {
      msg = '2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 조합해주세요';
    } else {
      nickFetchDuplicateCheck(inputValue);
      return;
    }

    saveInputState({
      key: 'nickname1',
      inputValue,
      msg,
      flag,
    });
  };

  const nickFetchDuplicateCheck = async (nickname) => {
    if (!nickname) {
      console.log('중복검사 할 닉네임 null 혹은 undefined!');
      return;
    }
    let msg = '';
    let flag = false;

    try {
      const res = await axios.get(`${API_BASE_URL}${USER}/nick-check`, {
        params: { nickname },
      });

      const result = await res.data;
      console.log(`nick중복체크 결과: ${result}`);

      if (result) {
        if (nickname === localStorage.getItem('NICK_NAME')) {
          msg = '기존 닉네임과 같습니다.';
          flag = true;
        } else {
          msg = '닉네임이 중복되었습니다. 다른 닉네임을 입력해 주세요.';
        }
      } else {
        msg = '사용 가능한 닉네임 입니다.';
        flag = true;
      }
    } catch (error) {
      msg = '중복 확인 중 오류가 발생했습니다.';
      console.error(error);
    }

    saveInputState({
      key: 'nickname1',
      inputValue: nickname,
      msg,
      flag,
    });

    // saveInputState({ key: 'nickname1', inputValue: nickname, msg, flag });
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
      msg = '비밀번호를 공백으로 두면 기존 비밀번호로 유지됩니다.';
    } else if (!passwordRegex.test(inputValue)) {
      msg = '8글자 이상의 영문, 숫자를 포함해주세요.';
    } else {
      msg = '사용가능한 비밀번호 입니다.';
      flag = true;
    }

    saveInputState({ key: 'password1', inputValue, msg, flag });
  };

  const pwCheckHandler = (e) => {
    let msg;
    let flag = false;

    if (!e.target.value) {
      msg = '비밀번호 확인란은 필수입니다.';
    } else if (userValue.password1 !== e.target.value) {
      msg = '입력한 비밀번호와 다릅니다.';
    } else {
      msg = '비밀번호가 일치합니다.';
      flag = true;
    }

    saveInputState({
      key: 'passwordCheck1',
      inputValue: 'pass',
      msg,
      flag,
    });
  };

  // 지역설정

  async function getAddr(lat, lng) {
    let geocoder = new kakao.maps.services.Geocoder();
    let coord = new kakao.maps.LatLng(lat, lng);
    let callback = await function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        // console.log(result);
        const area = result[0].address.region_1depth_name;
        // console.log(area);

        saveInputState({
          key: 'regionName1',
          inputValue: area,
          msg: '지역 설정 완료',
          flag: true,
        });
      }
      //
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          //getAddr(위도, 경도);
          getAddr(position.coords.latitude, position.coords.longitude);
          // console.log(position);
        },
        function (error) {
          console.error(error);
          alert('위치 조회를 차단하셨습니다! 차단 풀어주세요~');
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        },
      );
    } else {
      alert('현재 브라우저에서는 geolocation를 지원하지 않습니다');
    }
  }

  const addressClickHandler = () => {
    getLocation();
  };

  // 키워드
  const handleKeyDown = (value) => {
    // console.log(value);

    for (const keyword of currentKeywords) {
      if (keyword.favoriteKeyword === value) {
        alert('이미 존재하는 키워드입니다.');
        return;
      }
    }

    setCurrentKeywords((prve) => [
      ...prve,
      {
        favoriteNo:
          prve.length === 0 ? 1 : prve[prve.length - 1].favoriteNo + 1,
        favoriteKeyword: value,
      },
    ]);

    document.getElementById('keyword').value = '';
  };

  const deleteHandler = (e) => {
    const value = e.target.textContent;
    setCurrentKeywords((prve) => {
      const updatedKeywords = prve.filter((k) => k.favoriteKeyword !== value);
      return updatedKeywords;
    });
  };

  // 프로필 이미지 등록하기
  const $fileTag = useRef();

  const [imgFile, setImgFile] = useState(localStorage.getItem('PROFILE_IMAGE'));
  const showThumbnailHandler = (e) => {
    const file = $fileTag.current.files[0];
    console.log(`file: ${file}`);
    if (!file) return;

    const fileExt = file.name.slice(file.name.indexOf('.') + 1).toLowerCase();

    if (
      fileExt !== 'jpg' &&
      fileExt !== 'png' &&
      fileExt !== 'jpeg' &&
      fileExt !== 'gif'
    ) {
      alert('이미지 파일(jpg, png, jpeg, gif)만 등록이 가능합니다.');
      $fileTag.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log(`reader.result: ${reader.result}`);
      setImgFile(reader.result);
    };
  };

  const isValid = () => {
    if (
      message.nickname1.indexOf('기존') === -1 &&
      message.nickname1 !== '' &&
      !correct.nickname1
    ) {
      console.log('닉네임 정규표현식 위반');
      return false;
    }

    if (userValue.password1 && !correct.password1) {
      console.log('비밀번호가 비어있지 않은데 정규표현식 위반');
      return false;
    } else if (correct.password1 && !correct.passwordCheck1) {
      console.log('비밀번호가 작성된 상황에서 비밀번호 확인란 위반');
      return false;
    }

    return true;
  };

  const fetchUpdateMyInfoPost = async (userValue) => {
    console.log(`fetchUpdateMyInfoPost 메서드 실행 userValue: ${userValue}`);

    const userJsonBlob = new Blob([JSON.stringify(userValue)], {
      type: 'application/json',
    });
    console.log(userJsonBlob);

    const userFormData = new FormData();
    userFormData.append('user', userJsonBlob);

    if (imgFile && imgFile !== localStorage.getItem('PROFILE_IMAGE')) {
      userFormData.append('profileImage', $fileTag.current.files[0]);
    }

    const res = await axiosInstance.post(
      `${API_BASE_URL}${USER}/update-my-info`,
      userFormData,
    );

    if (res.status === 200) {
      alert('회원정보가 변경되었습니다. 다시 로그인하세요');
      onLogout();
      navigate('/login');
    }
  };

  function compareArraysValues(arr1, arr2) {
    console.log('arr1: ', arr1);
    console.log('arr2: ', arr2);

    // 먼저 배열의 길이가 같은지 확인
    if (arr1.length !== arr2.length) {
      return false;
    }

    console.log('catch!');

    // 각 배열의 값을 하나씩 비교
    for (let i = 0; i < arr1.length; i++) {
      // 배열의 값이 다른 경우 false 반환
      if (arr1[i].favoriteNo !== arr2[i].favoriteNo) {
        return false;
      }
    }
    console.log('catch!');

    // 모든 값이 같으면 true 반환
    return true;
  }

  const updateMyInfoHandler = (e) => {
    e.preventDefault();
    if (isValid()) {
      for (let key in userValue) {
        // 필터로 간소화
        switch (key) {
          case 'nickname1':
            if (userValue[key] === localStorage.getItem('NICK_NAME')) {
              delete userValue[key];
            }
            break;
          case 'password1':
            if (userValue[key] === '') {
              delete userValue[key];
            }
            break;
          case 'regionName1':
            if (userValue[key] === localStorage.getItem('REGION_NAME')) {
              delete userValue[key];
            }
            break;
          case 'favoriteKeywords1':
            if (compareArraysValues(userValue[key], currentKeywords)) {
              console.log('userValue[key] fk', userValue[key]);
              delete userValue[key];
            } else {
              userValue[key] = currentKeywords.map((fk) => fk.favoriteKeyword);
            }
            break;
        }
      }

      console.log(
        'Object.keys(userValue).length: ',
        Object.keys(userValue).length,
      );

      let isImageChanged = false;
      if (imgFile && imgFile !== localStorage.getItem('PROFILE_IMAGE')) {
        isImageChanged = true;
      }

      if (!Object.keys(userValue).length && !isImageChanged) {
        alert('변경한 정보가 없습니다. 홈으로 이동합니다.');
        navigate('/home');
        return;
      }

      fetchUpdateMyInfoPost(userValue);
    } else {
      alert('입력창을 다시 확인 해 주세요.');
    }
  };

  return (
    <>
      {isCheckPw ? (
        <Container className={styles.changeInfoContainer}>
          <Typography variant='h5' gutterBottom>
            내정보 변경
          </Typography>
          <Grid item xs={12}>
            <div
              className={styles.thumbnailBox}
              onClick={() => {
                $fileTag.current.click(); // 이 영역을 클릭하면 인풋창이 열린다.
              }}
            >
              <img
                src={
                  imgFile === 'null'
                    ? require('../../../assets/img/anonymous.jpg')
                    : imgFile
                }
                alt='profile'
              />

              {/* require 앞에 imgFile 변수 넣어야 함 */}
            </div>
            <label className={styles.signupImgLabel} htmlFor='profile-img'>
              프로필 이미지 추가
            </label>
            <input
              id='profile-img'
              type='file'
              style={{ display: 'none' }}
              accept='image/*'
              ref={$fileTag}
              onChange={showThumbnailHandler}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                id='email'
                label={localStorage.getItem('LOGIN_EMAIL')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                fullWidth
                name='nickname1'
                label='닉네임'
                type='text'
                id='nickname1'
                autoComplete='nickname1'
                defaultValue={userValue.nickname1}
                onChange={(e) => debouncedNickChangeHandler(e.target.value)}
              />
              <span
                id='check-span'
                style={
                  correct.nickname1 ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.nickname1}
              </span>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                fullWidth
                name='password1'
                label='패스워드'
                placeholder='변경할 패스워드를 입력해주세요'
                autoComplete='current-password'
                onChange={passwordHandler}
              />
              <span
                id='check-span'
                style={
                  correct.password1 ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.password1}
              </span>
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={userValue.password1 === '' ? true : undefined}
                variant='outlined'
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
                  correct.passwordCheck1 ? { color: 'green' } : { color: 'red' }
                }
              >
                {message.passwordCheck1}
              </span>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                id='regionName1'
                name='regionName1'
                InputProps={{
                  readOnly: true,
                  style: { color: 'gray' },
                }}
                defaultValue={regionName1}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                type='button'
                sx={{ height: '95%', width: '100%' }}
                style={{ background: '#1b1511' }}
                fullWidth
                variant='contained'
                onClick={addressClickHandler}
                startIcon={<PinDropIcon />}
              >
                지역 설정
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant='body2'
                style={{
                  fontSize: '20px',
                }}
              >
                issue-trend는 맞춤형 뉴스를 제공합니다.
              </Typography>
              <span
                style={{
                  color: '#1B1511',
                  margin: '10px 0',
                }}
              >
                맞춤형 뉴스를 제공받고 싶다면 관련 키워드를 추가해주세요.
              </span>
              <span
                style={{
                  display: 'block',
                  color: '#1B1511',
                  margin: '10px 0',
                }}
              >
                추가된 키워드를 클릭하면 삭제됩니다.
              </span>
            </Grid>
            <TextField
              sx={{
                mt: 2,
                ml: 2,
              }}
              type='text'
              placeholder='관심 키워드를 입력하고 엔터를 누르세요'
              id='keyword'
              fullWidth
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleKeyDown(e.target.value);
                }
              }}
            />
            <Grid item xs={12}>
              <ul className={styles.keywordList} style={{ display: 'flex' }}>
                {currentKeywords.map((keyword) => {
                  return (
                    <li
                      style={{ border: 'solid 1px black' }}
                      onClick={deleteHandler}
                      key={keyword.favoriteNo}
                    >
                      {keyword.favoriteKeyword}
                    </li>
                  );
                })}
              </ul>
            </Grid>
            <Grid item xs={12}>
              <Button
                type='button'
                variant='contained'
                style={{ background: '#1b1511' }}
                onClick={updateMyInfoHandler}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              >
                회원정보변경하기
              </Button>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <>
          <div
            className='password-check-page'
            style={{
              maxWidth: '400px',
              margin: '0 auto',
              padding: '20px',
              border: '1px solid #FFA927',
              borderRadius: '10px',
              backgroundColor: '#1B1511',
              color: '#FFA927',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant='body1'
              style={{
                color: '#FFA927',
                marginBottom: '20px',
                fontWeight: 'bold',
              }}
            >
              현재 비밀번호를 입력하세요
            </Typography>
            <TextField
              variant='outlined'
              type='password'
              fullWidth
              required
              onChange={(e) => debounceCurrentPasswordHandler(e.target.value)}
              onKeyDown={currentPasswordOnKeyDownHandler}
              InputProps={{
                style: {
                  backgroundColor: '#faeed7',
                  color: '#1B1511',
                },
              }}
              style={{ marginBottom: '20px', borderRadius: '5px' }}
            ></TextField>
            <span
              style={{
                color: passwordCheck.flag ? '#28a745' : '#dc3545',
                display: 'block',
                marginBottom: '20px',
                fontWeight: 'bold',
              }}
            >
              {passwordCheck.msg}
            </span>
            <Button
              type='button'
              disabled={!passwordCheck.flag}
              onClick={sendCheckPwHandler}
              style={{
                backgroundColor: passwordCheck.flag ? '#FFA927' : '#ccc',
                color: '#1B1511',
                borderColor: 'transparent',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: passwordCheck.flag ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
              }}
            >
              확인
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ChangeInfo;
