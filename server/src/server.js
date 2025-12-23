import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;

// Supabase client
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

// Game state
const players = new Map();
const missiles = new Map();

// WebSocket server
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on port ${PORT}`);

// Broadcast to all connected clients
function broadcast(type, payload, excludeClient = null) {
  const message = JSON.stringify({ type, payload });

  wss.clients.forEach(client => {
    if (client !== excludeClient && client.readyState === 1) {
      client.send(message);
    }
  });
}

// Send game state to all clients
function sendGameState() {
  const gameState = {
    players: Array.from(players.values()).map(p => ({
      id: p.id,
      nickname: p.nickname,
      x: p.x,
      y: p.y,
      z: p.z,
      qx: p.qx,
      qy: p.qy,
      qz: p.qz,
      qw: p.qw,
      health: p.health,
      score: p.score,
      isDead: p.isDead,
    })),
  };

  broadcast('gameState', gameState);
}

// Update leaderboard in Supabase
async function updateLeaderboard(playerId, nickname, score) {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('leaderboard')
      .upsert({
        player_id: playerId,
        nickname: nickname,
        score: score,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'player_id'
      });

    if (error) {
      console.error('Error updating leaderboard:', error);
    }
  } catch (err) {
    console.error('Supabase error:', err);
  }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  let currentPlayer = null;

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      const { type, payload } = message;

      switch (type) {
        case 'join':
          // Add player to game - spawn on runway
          currentPlayer = {
            id: payload.playerId,
            nickname: payload.nickname,
            x: 0,
            y: 5,
            z: 180,
            qx: 0,
            qy: Math.sin(Math.PI / 2),  // Facing -Z (towards island)
            qz: 0,
            qw: Math.cos(Math.PI / 2),
            health: 100,
            score: 0,
            isDead: false,
            ws: ws,
          };

          players.set(payload.playerId, currentPlayer);

          // Notify all players
          broadcast('playerJoined', {
            playerId: payload.playerId,
            nickname: payload.nickname,
          });

          // Send current players to new player
          const existingPlayers = Array.from(players.values())
            .filter(p => p.id !== payload.playerId)
            .map(p => ({
              playerId: p.id,
              nickname: p.nickname,
            }));

          ws.send(JSON.stringify({
            type: 'existingPlayers',
            payload: existingPlayers,
          }));

          console.log(`Player joined: ${payload.nickname} (${payload.playerId})`);
          break;

        case 'updatePlayer':
          // Update player state
          if (currentPlayer) {
            currentPlayer.x = payload.x;
            currentPlayer.y = payload.y;
            currentPlayer.z = payload.z;
            currentPlayer.qx = payload.qx;
            currentPlayer.qy = payload.qy;
            currentPlayer.qz = payload.qz;
            currentPlayer.qw = payload.qw;
            currentPlayer.health = payload.health;
            currentPlayer.score = payload.score;
            currentPlayer.isDead = payload.isDead;
          }
          break;

        case 'fire':
          // Broadcast missile to all players
          missiles.set(payload.missileId, {
            id: payload.missileId,
            playerId: currentPlayer.id,
            position: payload.position,
            velocity: payload.velocity,
          });

          broadcast('missileFired', {
            missileId: payload.missileId,
            playerId: currentPlayer.id,
            position: payload.position,
            velocity: payload.velocity,
          }, ws);
          break;

        case 'missileHit':
          // Handle missile hit
          const victim = players.get(payload.victimId);
          const killer = players.get(payload.killerId);

          if (victim && killer) {
            victim.health = 0;
            victim.isDead = true;
            killer.score += 1;

            // Update leaderboard
            await updateLeaderboard(killer.id, killer.nickname, killer.score);

            // Broadcast kill event
            broadcast('playerKilled', {
              victimId: victim.id,
              victimName: victim.nickname,
              killerId: killer.id,
              killerName: killer.nickname,
            });

            console.log(`${killer.nickname} killed ${victim.nickname}`);
          }

          // Remove missile
          missiles.delete(payload.missileId);
          break;

        case 'respawn':
          // Respawn player
          if (currentPlayer) {
            currentPlayer.x = payload.x;
            currentPlayer.y = payload.y;
            currentPlayer.z = payload.z;
            currentPlayer.health = 100;
            currentPlayer.isDead = false;
          }
          break;

        default:
          console.log('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    if (currentPlayer) {
      players.delete(currentPlayer.id);
      broadcast('playerLeft', {
        playerId: currentPlayer.id,
      });
      console.log(`Player left: ${currentPlayer.nickname}`);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Game loop - send state updates to all clients
setInterval(() => {
  if (players.size > 0) {
    sendGameState();
  }
}, 1000 / 20); // 20 updates per second

// Cleanup inactive missiles
setInterval(() => {
  const now = Date.now();
  missiles.forEach((missile, id) => {
    if (now - missile.createdAt > 5000) {
      missiles.delete(id);
    }
  });
}, 1000);

console.log('Game server started!');
