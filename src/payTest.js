import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config/host-config';

const PayTest = () => {
  const [tid, setTid] = useState('');
  const [userNum, setUserNum] = useState(localStorage.getItem('USER_NO'));
  const [isSubscribed, setIsSubscribed] = useState(false);

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
      await axios.post(`${API_BASE_URL}/payment/cancelSubscription/${userNum}`);
      setIsSubscribed(false);
      alert('구독이 취소되었습니다.');
      window.location.href = 'https://issuetrend.site/home';
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  return (
    <div style={{ marginTop: '300px', textAlign: 'center' }}>
      <h1>Payment Component</h1>
      {userNum ? (
        isSubscribed ? (
          <button onClick={handleCancelSubscription}>구독취소</button>
        ) : (
          <button onClick={handlePayment}>구독하기</button>
        )
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
};

export default PayTest;
