import { Component } from '@angular/core';
import { Dati } from '../dati';
import { Transazione } from '../../models/transazioniModel';
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
    for (let i = 0; i < this.dati.listaTransazioni.length; i++) {
      if (this.dati.listaTransazioni[i].id === this.dati.accountCorrente.account_id) {
        this.tra.push(this.dati.listaTransazioni[i]);
      }
    }
  }


}
