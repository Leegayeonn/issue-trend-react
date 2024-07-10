import React, { useEffect, useState } from 'react';
import styles from '../../styles/Subscibe.module.scss';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import img from '../../assets/img/newspaper.jpg';
import pay from '../../assets/img/payment.png';
import axios from 'axios';
import useNavigation from '../../common/func/useNavigation';
import { API_BASE_URL } from '../../config/host-config';

const Subscribe = () => {
  const { container, head, content, payBox, cancel, contentContainer, title } =
    styles;

  const [tid, setTid] = useState('');
  const [userNum, setUserNum] = useState(localStorage.getItem('USER_NO'));
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { goLogin } = useNavigation();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/payment/subscriptionStatus/${userNum}`,
        );
        setIsSubscribed(response.data.isSubscribed);
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };
    checkSubscriptionStatus();
  }, [userNum]);

  const handlePayment = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/ready`, {
        userNo: userNum,
        itemName: '구독 서비스',
        quantity: 1,
        totalAmount: 9900,
      });
      const { nextRedirectPcUrl, tid } = response.data;
      console.log('RedirectUrl: ', nextRedirectPcUrl);
      setTid(tid);
      window.location.href = nextRedirectPcUrl;
    } catch (error) {
      console.error('Error preparing payment:', error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      if (confirm('구독 취소하시겠습니까?')) {
        alert('구독이 취소되었습니다.\n다음에 또 이용해주세요!');
      } else {
        alert('구독이 계속 진행됩니다.');
        return;
      }
      await axios.post(`${API_BASE_URL}/payment/cancelSubscription/${userNum}`);
      setIsSubscribed(false);
      window.location.href = 'https://issuetrend.site/payment';
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  return (
    <div className={container}>
      <div className={head}>
        <h1>뉴스레터</h1>
        <h2>
          로그인 후 뉴스레터 결제하시면 등록한 관심키워드 관련 기사를 이메일로
          받을 수 있습니다.
        </h2>
      </div>
      <div className={contentContainer}>
        <div className={title}>결제하기</div>
        <Card sx={{ maxWidth: 500, margin: '0 auto' }}>
          <CardMedia component='img' alt='paper' height='400' image={img} />
          <div className={content}>
            <CardContent>
              <Typography variant='body2' color='text.secondary'>
                안녕하세요! 우리 서비스는 구독을 통해 가입 시 입력한 키워드를
                기반으로 관련된 최신 기사를 이메일로 받아보실 수 있는 시스템을
                제공합니다. 구독을 통해 원하는 정보와 뉴스를 빠르고 간편하게
                확인하세요!
              </Typography>
            </CardContent>
            <CardActions className={payBox}>
              <Typography gutterBottom variant='h5' component='div'>
                9,900원
              </Typography>
              <div>
                {userNum ? (
                  isSubscribed ? (
                    <div className={cancel} onClick={handleCancelSubscription}>
                      구독취소
                    </div>
                  ) : (
                    <img src={pay} onClick={handlePayment} />
                  )
                ) : (
                  <div className={cancel} onClick={goLogin}>
                    로그인을 해주세요
                  </div>
                )}
              </div>
            </CardActions>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Subscribe;
