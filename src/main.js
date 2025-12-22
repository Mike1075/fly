import { GameManager } from './game/GameManager.js';

const game = new GameManager();

// Handle login
const startButton = document.getElementById('start-button');
const nicknameInput = document.getElementById('nickname-input');

startButton.addEventListener('click', () => {
  const nickname = nicknameInput.value.trim();

  if (!nickname) {
    alert('Please enter a nickname');
    return;
  }

  game.startGame(nickname);
});

// Allow Enter key to start game
nicknameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    startButton.click();
  }
});
