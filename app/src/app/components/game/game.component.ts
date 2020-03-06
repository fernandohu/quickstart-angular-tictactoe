import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Square} from '../../entities/Square';
import {HistoryItem} from '../../entities/HistoryItem';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  squares: Array<Square>;
  nextPlayer: string;
  currentPlayer: string;
  reverse: boolean;
  movesHistory: Array<HistoryItem>;
  winner: string;
  stepNumber: number;
  reverseList: boolean;
  selectedHistoryIndex: number;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.reverseList = false;
    this.selectedHistoryIndex = -2;
    this.movesHistory = [];
    this.initializeStateInfo();
  }

  private initializeStateInfo() {
    this.currentPlayer = 'X';
    this.squares = this.generateSquares();
    this.nextPlayer = 'Player 1 (X)';
    this.reverse = false;
    this.winner = '';
    this.stepNumber = -1;
  }

  onSquareClick(square): void {
    if (square.label || this.winner) {
      return;
    }

    this.executeMovement(square);
  }

  executeMovement(square: Square): void {
    square.label = this.currentPlayer;

    this.cutHistoryIfNeeded();
    this.incrementPlay();
    this.verifyWinner();
    this.changePlayer();
    this.saveHistory(square);
    this.unhighlightHistory();
  }

  private incrementPlay() {
    this.stepNumber++;
  }

  changePlayer(): void {
    this.currentPlayer = (this.currentPlayer === 'X') ? 'O' : 'X';

    if (this.currentPlayer === 'X') {
      this.nextPlayer = 'Player 1 (X)';
    } else {
      this.nextPlayer = 'Player 2 (O)';
    }
  }

  saveHistory(square: Square): void {
    this.movesHistory.push(this.getDataToSave(square));
  }

  private getDataToSave(square: Square) {
    return {
      squares: this.cloneSquares(this.squares),
      stepNumber: this.stepNumber - 1,
      movePosition: this.getPositionFromIndex(square.index),
      nextPlayer: this.nextPlayer,
      currentPlayer: this.currentPlayer,
      winner: this.winner
    };
  }

  private restoreData(history: HistoryItem) {
    if (history) {
      this.squares = this.cloneSquares(history.squares);
      this.nextPlayer = history.nextPlayer;
      this.currentPlayer = history.currentPlayer;
      this.winner = history.winner;
      this.stepNumber = history.stepNumber + 1;
    } else {
      this.initializeStateInfo();
    }
  }

  private cloneSquares(squares) {
    return JSON.parse(JSON.stringify(squares));
  }

  private cutHistoryIfNeeded() {
    if (this.stepNumber === -1) {
      this.movesHistory = [];
      return;
    }

    if (this.movesHistory.length - 1 >= this.stepNumber) {
      this.movesHistory = this.movesHistory.slice(0, this.stepNumber + 1);
    }
  }

  private verifyWinner(): void {
    const winner = this.calculateWinner();
    if (winner) {
      this.winner = winner;
    } else {
      this.winner = '';
    }
  }

  goToHistory(index: number): void {
      if (index < 0) {
          this.restoreData(null);
      } else {
          this.restoreData(this.movesHistory[index]);
      }

      this.highlightHistory(index);
  }

  highlightHistory(index: number): void {
      this.selectedHistoryIndex = index;
  }

  unhighlightHistory(index: number): void {
    this.selectedHistoryIndex = -2;
  }

  getHistoryList(): any {
    const listItems = [{label: 'Go to game start', index: -1, selected: this.selectedHistoryIndex === -1}];

    this.movesHistory.forEach((item, i) => {
        listItems.push({
            label: 'Go to move #' + i + ' (' + item.movePosition + ')',
            index: i,
            selected: this.selectedHistoryIndex === i
        });
    });

    if (this.reverseList) {
      return listItems.reverse();
    } else {
      return listItems;
    }
  }

  private calculateWinner(): string {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const squares = this.squares;

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a].label && squares[a].label === squares[b].label && squares[a].label === squares[c].label) {
        squares[a].color = 'blue';
        squares[b].color = 'blue';
        squares[c].color = 'blue';
        return squares[a].label;
      }
    }

    let allFilled = true;
    for (let i = 0; i <= squares.length - 1; i++) {
      if (squares[i].label === '') {
        allFilled = false;
      }
    }

    if (allFilled) {
      return 'draw';
    }

    return null;
  }

  private getPositionFromIndex(index): string {
    switch (index) {
      case 0:
        return '1, 1';
      case 1:
        return '2, 1';
      case 2:
        return '3, 1';
      case 3:
        return '1, 2';
      case 4:
        return '2, 2';
      case 5:
        return '3, 2';
      case 6:
        return '1, 3';
      case 7:
        return '2, 3';
      case 8:
        return '3, 3';
    }

    return '';
  }

  private generateSquares(): any {
    return Array(9).fill(null).map((item, index) => ({
      label: '',
      index: index,
      color: '#444444'
    }));
  }
}
