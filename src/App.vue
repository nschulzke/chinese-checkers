<script setup lang="ts">
import { Client } from 'boardgame.io/client'
import { TicTacToe, type G } from '@/game/TicTacToe.ts'
import { ref } from 'vue'
import type { ClientState } from 'boardgame.io/src/client/client.ts'
import { Grid, type AxialVector, Players } from './game/ChineseCheckers'

const gameState = ref<ClientState<G> | null>(null)

const grid = new Grid()

const client = Client({ game: TicTacToe })
client.start()

client.subscribe((state) => {
  gameState.value = state
})

function toXY(size: number, vector: AxialVector): { x: number; y: number } {
  return {
    x: size * Math.sqrt(3) * (vector.q + vector.r / 2),
    y: size * (3 / 2) * vector.r,
  }
}

function toTranslate(size: number, vector: AxialVector): string {
  const { x, y } = toXY(size, vector)
  return `translate(${x},${y})`
}
</script>

<template>
  <svg class="grid" viewBox="-1400 -1400 2800 2800">
    <circle cx="0" cy="0" r="1400" fill="#ba8f5a" />
    <circle cx="0" cy="0" r="1300" fill="#c19a6b" />

    <g
      v-for="{ vector, cell } in grid.allCells()"
      key="`${vector.q},${vector.r}`"
      :transform="toTranslate(100, vector)"
    >
      <polygon class="cell" points="100,0 50,-87 -50,-87 -100,-0 -50,87 50,87"></polygon>
      <g>
        <g class="hoverable" v-if="cell.type === 'marble'" :class="`marble player-${cell.player}`">
          <!-- Marble -->
          <circle
            cx="0"
            cy="0"
            r="80"
            :fill="`url(#gradient-${cell.player})`"
            filter="url(#shadowFilter)"
          />
        </g>
        <g v-else>
          <!-- Hole -->
          <circle r="80" fill="url(#holeGradient)" />
        </g>
      </g>
    </g>

    <!-- Shadow filter -->
    <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="5" stdDeviation="5" flood-color="rgba(0, 0, 0, 0.5)" />
    </filter>

    <!-- Gradient for the hole -->
    <defs>
      <radialGradient id="holeGradient" cx="0.3" cy="0.3" r="0.9">
        <stop offset="0%" stop-color="#a76c34" />
        <stop offset="50%" stop-color="#c19a6b" />
        <stop offset="100%" stop-color="#e3b25f" />
      </radialGradient>
    </defs>

    <!-- Gradient for 3D effect -->
    <defs v-for="(player, key) of Players">
      <radialGradient :id="`gradient-${key}`" cx="0.3" cy="0.3" r="0.7">
        <stop offset="0%" :stop-color="player.color.stop0" />
        <stop offset="50%" :stop-color="player.color.stop1" />
        <stop offset="100%" :stop-color="player.color.stop2" />
      </radialGradient>
    </defs>
  </svg>
</template>

<style scoped>
.hoverable {
  transition:
    transform 0.2s,
    filter 0.2s;
}

.hoverable:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.grid {
  width: 750px;
  height: 750px;
}

.cell {
  fill: #c19a6b;
  /* stroke: black; */
  rotate: 30deg;
}

.q-coord {
  font-size: 2em;
}

.r-coord {
  font-size: 2em;
}

.marble {
  font-size: 2em;
}

.player-0 {
  fill: red;
}

.player-1 {
  fill: black;
}

.player-2 {
  fill: blue;
}

.player-3 {
  fill: green;
}

.player-4 {
  fill: white;
}

.player-5 {
  fill: yellow;
}
</style>
