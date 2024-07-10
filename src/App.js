import NewsTemplate from './components/board/NewsTemplate';
import Intro from './components/main/Intro';
import Home from './components/main/Home';
import Join from './components/user/Join';
import './App.css';
import Layout from './common/layout/Layout';
import ReportTemplate from './components/board/ReportTemplate';
import ReportDetail from './components/board/ReportDetail';

import Login from './components/user/Login';
import NewsDetailModal from './components/board/NewsDetailModal';
import AuthContext, {
  AuthContextProvider,
  isAuthenticated,
} from './components/store/auth-context';
import { useContext, useEffect, useState } from 'react';
import MyPage from './components/user/mypage/MyPage';
import ReportWriteModal from './components/board/ReportWriteModal';
import KakaoLoginHandler from './components/user/KakaoLoginHandler';
import RegionScreen from './components/regionInfo/RegionScreen';
import PayTest from './payTest';
import NaverMapApi from './components/regionInfo/NaverMapApi';
import Subscribe from './components/subscribe/Subscribe';
import { Route, Routes } from 'react-router-dom';

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/' element={<Layout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/news' element={<NewsTemplate />} />
          <Route path='/news/:id' element={<NewsTemplate />} />
          <Route path='/login' element={<Login />} />
          <Route path='/join' element={<Join />} />

          <Route path='/oauth/kakao' element={<KakaoLoginHandler />} />
          <Route path='/board' element={<ReportTemplate />} />
          <Route path='/board/:id' element={<ReportTemplate />} />
          <Route path='/board/detail/:id' element={<ReportDetail />} />
          <Route path='/issue-trend/mypage' element={<MyPage />} />
          <Route path='/region-info' element={<RegionScreen />} />
          <Route path='/map-test' element={<NaverMapApi />} />
          <Route path='/payment' element={<Subscribe />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
