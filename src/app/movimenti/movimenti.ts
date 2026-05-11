import { Component } from '@angular/core';
import { Dati } from '../dati';
import { Transazione } from '../../models/transazione';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movimenti',
  imports: [FormsModule, CommonModule],
  templateUrl: './movimenti.html',
  styleUrl: './movimenti.css',
})
export class Movimenti {
  constructor(private dati: Dati) {
  }
    tra : Transazione[] = [];

  ngOnInit() {
    this.tra = this.dati.listaTransazioni;
  }



}
