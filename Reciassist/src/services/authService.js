// authService.js
import mockUsers from './datas/users.json';

const STORAGE_KEY = 'mockUsers';
const SESSION_KEY = 'loggedUser';

function initUsers() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
  }
}

function loadUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getSessionData() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export function getCurrentUser() {
  const session = getSessionData();
  return session?.user || null;
}

export function isLoggedIn() {
  return getCurrentUser() !== null;
}

export function setSession(user) {
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 giờ
  const session = { user, expiresAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loginUser({ username, password }) {
  const users = loadUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("Invalid username or password");
  setSession(user);
  return user;
}

export function registerUser({ username, email, password }) {
  const users = loadUsers();

  if (users.find((u) => u.username === username || u.email === email)) {
    throw new Error("Username or email already exists");
  }

  // Tìm id lớn nhất trong danh sách user hiện tại
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) : 0;

  const newUser = {
    id: maxId + 1, // ID tự tăng
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

export function logoutUser() {
  clearSession();
}

export function bootstrap() {
  initUsers();
}
