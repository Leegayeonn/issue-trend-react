import React, { useEffect, useRef, useState } from 'react';
import logo from '../../assets/img/logo.png';
import styles from '../../styles/Header.module.scss';
import { useNavigate } from 'react-router-dom';
import ChatModal from '../../components/chat/ChatModal';

const Header = () => {
  const {
    header,
    headerContainer,
    headerItem,
    items,
    btnGroup,
    btn,
    btn1,
    btn2,
    changeHeader,
    section,
    changeItem,
    changeBtnGroup,
  } = styles;

  const navigate = useNavigate();
  const joinClickHandler = () => {
    navigate('/join');
  };

  // 스크롤시 헤더 색상 변경
  const [scrollPosition, setScrollPosition] = useState(0);

  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  }, []);

  const goHome = () => {
    navigate('/home');
  };

  const goNews = () => {
    navigate('/newsList');
  };

  const childButtonRef = useRef(null);
  // '실시간' 메뉴 클릭 이벤트 핸들러
  const openChatModal = () => {
    console.log('click chat Button!');
    childButtonRef.current.handleOpen();
  };

  return (
    <header
      className={scrollPosition < 10 ? header : `${header} ${changeHeader}`}
    >
      <div className={headerContainer}>
        {scrollPosition < 10 ? (
          <img
            src={logo}
            height='100'
            alt='로고이미지'
            onClick={goHome}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          ''
        )}
        <div
          className={
            scrollPosition < 10 ? headerItem : `${headerItem} ${changeItem}`
          }
        >
          <div className={items} onClick={goNews}>
            뉴스{' '}
          </div>
          <div>|</div>
          <div className={items}>게시판 </div>
          <div>|</div>
          <div className={items} onClick={openChatModal}>
            실시간
          </div>
          <div style={{ display: 'none' }}>
            <ChatModal ref={childButtonRef} />
          </div>
        </div>

        <div
          className={
            scrollPosition < 10 ? btnGroup : `${btnGroup} ${changeBtnGroup}`
          }
        >
          <div className={`${btn} ${btn1}`}>로그인</div>
          <div className={`${btn} ${btn2}`} onClick={joinClickHandler}>
            회원가입
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
