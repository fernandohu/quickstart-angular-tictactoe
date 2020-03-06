import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Square} from '../../entities/Square';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @Input() squares: Array<Square>;
  @Output() onSquareClick: EventEmitter<any>;

  constructor() {
    this.onSquareClick = new EventEmitter();
  }

  ngOnInit(): void {

  }
}
