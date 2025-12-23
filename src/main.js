import { GameManager } from './game/GameManager.js';

// Debug: Log when script loads
console.log('✅ main.js loaded successfully');
console.log('Environment check:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing',
  wsUrl: import.meta.env.VITE_WS_URL ? '✓ Set' : '✗ Missing',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'
});

const game = new GameManager();

// Handle login
const startButton = document.getElementById('start-button');
const nicknameInput = document.getElementById('nickname-input');

// Debug: Log DOM elements
console.log('DOM elements:', {
  startButton: startButton ? '✓ Found' : '✗ Not found',
  nicknameInput: nicknameInput ? '✓ Found' : '✗ Not found'
});

startButton.addEventListener('click', () => {
  console.log('🎮 Start button clicked!');
  const nickname = nicknameInput.value.trim();
  console.log('Nickname entered:', nickname);

  if (!nickname) {
    alert('Please enter a nickname');
    return;
  }

  console.log('Starting game...');
  game.startGame(nickname);
});

// Allow Enter key to start game
nicknameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    startButton.click();
  }
});
