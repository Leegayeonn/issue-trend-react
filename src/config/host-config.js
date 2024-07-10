const clientHostName = window.location.hostname;

let backEndHostName;

if (clientHostName === 'localhost') {
  backEndHostName = 'http://localhost:8181';
} else if (clientHostName === 'issuetrend.site') {
  backEndHostName = 'issuetrend.online';
}

export const API_BASE_URL = backEndHostName;
export const USER = '/issue-trend';
export const ONLY_IP = '13.209.56.91';
