import {Square} from './Square';

export class HistoryItem {
  squares: Array<Square>;

  stepNumber: number;

  movePosition: string;

  nextPlayer: string;

  currentPlayer: string;

  winner: string;
}
