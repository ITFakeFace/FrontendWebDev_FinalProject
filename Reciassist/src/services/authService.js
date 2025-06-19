import mockUsers from './datas/users.json';

const STORAGE_KEY = 'mockUsers';
const SESSION_KEY = 'token';

function initUsers() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
  }
}

function loadUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function isLoggedIn() {
  return getSession() != null;
}

function setSession(user) {
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1h
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, expiresAt }));
}

function getSession() {
  const data = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (!data) return null;
  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return data.user;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function login({ username, password }) {
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error("Invalid username or password");
  setSession(user);
  return user;
}

export function register({ username, email, password }) {
  const users = loadUsers();
  if (users.find(u => u.username === username || u.email === email)) {
    throw new Error("Username or email already exists");
  }

  const newUser = {
    username,
    email,
    password,
    avatar: null,
    dob: null,
    gender: null,
    phone: null,
    favorite: [],
  };
  users.push(newUser);
  saveUsers(users);
  setSession(newUser);
  return newUser;
}

export function getCurrentUser() {
  return getSession();
}

export function logout() {
  clearSession();
}

export function bootstrap() {
  initUsers();
}
