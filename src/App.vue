<script setup lang="ts">
import { Client } from 'boardgame.io/client'
import { TicTacToe } from '@/game/TicTacToe.ts'
import { ref } from 'vue'
import { ClientState } from 'boardgame.io/src/client/client.ts'

const gameState = ref<ClientState<TicTacToe> | null>(null)

const client = Client({ game: TicTacToe });
client.start();

client.subscribe((state) => {
  gameState.value = state;
});
</script>

<template>
  <div>
    <div>Current player: {{ gameState.ctx.currentPlayer }}</div>
    <div v-if="gameState.ctx.gameover">
      <div v-if="gameState.ctx.gameover.winner !== undefined">
        Winner: {{ gameState.ctx.gameover.winner }}
      </div>
      <div v-else>
        Draw!
      </div>
    </div>
    <table>
      <tr v-for="i in 3" :key="i">
        <td v-for="j in 3" :key="j" class="cell" @click="client.moves.clickCell(3 * (i - 1) + (j - 1))">
          <span>{{ gameState.G.cells[3 * (i - 1) + (j - 1)] }}</span>
        </td>
      </tr>
    </table>
    <p class="winner"></p>
  </div>
</template>

<style scoped>
.cell {
  border: 1px solid #555;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>
