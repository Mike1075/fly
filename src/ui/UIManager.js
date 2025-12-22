export class UIManager {
  constructor() {
    this.loginScreen = document.getElementById('login-screen');
    this.hud = document.getElementById('hud');
    this.leaderboardList = document.getElementById('leaderboard-list');
    this.killFeed = document.getElementById('kill-feed');
    this.minimapCanvas = document.getElementById('minimap');
    this.minimapCtx = this.minimapCanvas.getContext('2d');

    this.killFeedTimeout = null;
  }

  hideLoginScreen() {
    this.loginScreen.classList.add('hidden');
  }

  showHUD() {
    this.hud.classList.remove('hidden');
  }

  updateLeaderboard(players, currentPlayerId) {
    // Sort players by score
    const sorted = players.sort((a, b) => b.score - a.score);

    // Display top 10
    const top10 = sorted.slice(0, 10);

    this.leaderboardList.innerHTML = top10.map((player, index) => {
      const isMe = player.id === currentPlayerId;
      return `
        <div class="leaderboard-entry ${isMe ? 'me' : ''}">
          <span>${index + 1}. ${player.nickname}</span>
          <span>${player.score}</span>
        </div>
      `;
    }).join('');
  }

  showKillFeed(message) {
    this.killFeed.textContent = message;
    this.killFeed.classList.add('show');

    if (this.killFeedTimeout) {
      clearTimeout(this.killFeedTimeout);
    }

    this.killFeedTimeout = setTimeout(() => {
      this.killFeed.classList.remove('show');
    }, 3000);
  }

  updateMinimap(localPlayer, remotePlayers) {
    const canvas = this.minimapCanvas;
    const ctx = this.minimapCtx;

    canvas.width = 200;
    canvas.height = 200;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!localPlayer) return;

    const scale = 0.05; // Scale factor for world to minimap
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw local player (always at center)
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw remote players
    remotePlayers.forEach(player => {
      const dx = (player.position.x - localPlayer.position.x) * scale;
      const dz = (player.position.z - localPlayer.position.z) * scale;

      const x = centerX + dx;
      const y = centerY + dz;

      // Only draw if within minimap bounds
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw border
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }
}
