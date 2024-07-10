import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const CustomSnackBar = ({ open }) => {
  const vertical = 'top';
  const horizontal = 'center';

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      style={{ marginTop: '150px' }}
      open={open}
      autoHideDuration={4000}
      key={vertical + horizontal}
    >
      <Alert
        severity='info'
        sx={{
          width: '100%',
          maxWidth: '600px',
          padding: '16px 24px',
          fontSize: '16px',
          backgroundColor: '#faeed7', // 밝은 배경색
          color: 'black', // 글자색
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 부드러운 그림자 추가
          borderRadius: '8px', // 모서리를 둥글게 설정
        }}
      >
        <AlertTitle
          style={{ fontWeight: 'bold', fontSize: '18px', color: 'black' }}
        >
          Information
        </AlertTitle>
        이미 로그인 중입니다.
        <br /> 자동으로 홈 화면으로 이동합니다.
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
