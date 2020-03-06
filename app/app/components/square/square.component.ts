import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Square} from '../../entities/Square';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
})
export class SquareComponent implements OnInit {

  @Input() square: Square;
  @Output() onSquareClick: EventEmitter<any>;

  constructor() {
    this.onSquareClick = new EventEmitter();
  }

  ngOnInit(): void {
  }

}
