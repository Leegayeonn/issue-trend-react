import React, { useEffect, useState } from 'react';
import styles from '../../styles/Search.module.scss';
import { API_BASE_URL, USER, ONLY_IP } from '../../config/host-config';

const Search = () => {
  const { searchContainer, title, content, contentDetail, number, date, fade } =
    styles;

  const [search, setSearch] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`wss://search.issuetrend.online:3000`); // WebSocket 서버 주소
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSearch(data);
      console.log(search);

      const now = new Date();
      const formattedTime = now.toLocaleString('ko-KR', {
        hour: '2-digit',
        month: '2-digit',
        day: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLastUpdated(formattedTime);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className={searchContainer}>
      <div className={title}>
        <h1>실시간 검색어</h1>
        <div className={date}>
          <p>{lastUpdated} 기준</p>
        </div>
      </div>

      <ul className={contentDetail}>
        {search.map((rank, index) => (
          <li key={index}>
            <p>{index + 1}</p>
            <span>{rank}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
