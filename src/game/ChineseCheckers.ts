import type { Game } from 'boardgame.io'

export type Cell = { type: 'empty' } | { type: 'marble'; player: PlayerNumber } | { type: 'wall' }

export const ChineseCheckers: Game = {}

export type AxialVector = { q: number; r: number }

const UnitVectors = {
  UpLeft: { q: 0, r: -1 },
  UpRight: { q: 1, r: -1 },
  Left: { q: -1, r: 0 },
  Right: { q: 1, r: 0 },
  DownLeft: { q: -1, r: 1 },
  DownRight: { q: 0, r: 1 },
}

type Orientation = 'up' | 'down'

type PlayerNumber = '0' | '1' | '2' | '3' | '4' | '5'

interface Player {
  startingPosition: StartingPosition
  color: {
    name: string
    stop0: string
    stop1: string
    stop2: string
  }
}

type StartingPosition = { vector: AxialVector; orientation: Orientation }

export const Players: Record<PlayerNumber, Player> = {
  '0': {
    startingPosition: {
      vector: { q: 4, r: -8 },
      orientation: 'down',
    },
    color: {
      name: 'Red',
      stop0: '#ff9999',
      stop1: '#ff4d4d',
      stop2: '#990000',
    },
  },
  '1': {
    startingPosition: {
      vector: { q: 5, r: -1 },
      orientation: 'up',
    },
    color: {
      name: 'Black',
      stop0: '#666666',
      stop1: '#333333',
      stop2: '#000000',
    },
  },
  '2': {
    startingPosition: {
      vector: { q: 4, r: 1 },
      orientation: 'down',
    },
    color: {
      name: 'Blue',
      stop0: '#99ccff',
      stop1: '#4682b4',
      stop2: '#000080',
    },
  },
  '3': {
    startingPosition: {
      vector: { q: -4, r: 8 },
      orientation: 'up',
    },
    color: {
      name: 'Green',
      stop0: '#99ff99',
      stop1: '#32cd32',
      stop2: '#006400',
    },
  },
  '4': {
    startingPosition: {
      vector: { q: -5, r: 1 },
      orientation: 'down',
    },
    color: {
      name: 'White',
      stop0: '#ffffff',
      stop1: '#cccccc',
      stop2: '#999999',
    },
  },
  '5': {
    startingPosition: {
      vector: { q: -4, r: -1 },
      orientation: 'up',
    },
    color: {
      name: 'Yellow',
      stop0: '#ffff99',
      stop1: '#ffd700',
      stop2: '#ff8c00',
    },
  },
}

function starPattern(radius: number, callback: (vector: AxialVector) => void) {
  let current = scaleVector(UnitVectors.Right, radius)

  function move(unit: AxialVector) {
    for (let i = 0; i < radius; i++) {
      current = addVectors(current, unit)
      callback(current)
    }
  }

  move(UnitVectors.UpRight)
  move(UnitVectors.Left)
  move(UnitVectors.UpLeft)
  move(UnitVectors.DownLeft)
  move(UnitVectors.Left)
  move(UnitVectors.DownRight)
  move(UnitVectors.DownLeft)
  move(UnitVectors.Right)
  move(UnitVectors.DownRight)
  move(UnitVectors.UpRight)
  move(UnitVectors.Right)
  move(UnitVectors.UpLeft)
}

function drawStartingPosition(
  startingPosition: StartingPosition,
  callback: (vector: AxialVector) => void,
) {
  let current = startingPosition.vector

  function move(distance: number, unit: AxialVector) {
    for (let i = 0; i < distance; i++) {
      current = addVectors(current, unit)
      callback(current)
    }
  }

  if (startingPosition.orientation === 'down') {
    callback(current)
    move(3, UnitVectors.DownRight)
    move(1, UnitVectors.Left)
    move(2, UnitVectors.UpLeft)
    move(1, UnitVectors.DownLeft)
    move(1, UnitVectors.DownRight)
    move(1, UnitVectors.Left)
  } else {
    callback(current)
    move(3, UnitVectors.UpLeft)
    move(1, UnitVectors.Right)
    move(2, UnitVectors.DownRight)
    move(1, UnitVectors.UpRight)
    move(1, UnitVectors.UpLeft)
    move(1, UnitVectors.Right)
  }
}

function scaleVector(vector: AxialVector, scalar: number) {
  return { q: vector.q * scalar, r: vector.r * scalar }
}

function addVectors(a: AxialVector, b: AxialVector) {
  return { q: a.q + b.q, r: a.r + b.r }
}

export class Grid {
  private cells: Record<string, Cell> = {}

  constructor() {
    for (let radius = 1; radius <= 4; radius++) {
      console.log('radius', radius)
      starPattern(radius, ({ q, r }) => {
        console.log(q, r)
        this.cells[`${q},${r}`] = { type: 'empty' }
      })
    }
    this.cells['0,0'] = { type: 'empty' }
    for (const playerNumber in Players) {
      const player = Players[playerNumber as PlayerNumber]
      drawStartingPosition(player.startingPosition, (vector) => {
        this.setCell(vector, { type: 'marble', player: playerNumber })
      })
    }
  }

  getCell({ q, r }: AxialVector) {
    if (!this.cells[`${q},${r}`]) {
      return { type: 'wall' }
    } else {
      return this.cells[`${q},${r}`]
    }
  }

  setCell({ q, r }: AxialVector, cell: Cell) {
    if (this.cells[`${q},${r}`]) {
      this.cells[`${q},${r}`] = cell
    } else {
      // No-op
    }
  }

  allCells(): { vector: AxialVector; cell: Cell }[] {
    return Object.entries(this.cells).map(([key, cell]) => {
      const [q, r] = key.split(',').map(Number)
      return { vector: { q, r }, cell }
    })
  }
}
