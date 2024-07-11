const clientHostName = window.location.hostname;

let backEndHostName;

if (clientHostName === 'localhost') {
  backEndHostName = 'http://localhost:8181';
} else if (clientHostName === 'issuetrend.site') {
  backEndHostName = 'https://issuetrend.online';
}

export const API_BASE_URL = backEndHostName;
export const USER = '/issue-trend';
export const ONLY_IP = '3.34.116.209';
