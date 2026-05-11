import { Component } from '@angular/core';
import { Transazione } from '../../models/transazione';
import { FormsModule } from '@angular/forms';
import { Dati } from '../dati';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-deposito',
  imports: [FormsModule],
  templateUrl: './deposito.html',
  styleUrl: './deposito.css',
})
export class Deposito {

  constructor(private dati: Dati,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  tr: Transazione = {
    id: 0,
    importo: 0,
    dettagli: ' ',
  } as Transazione;

  aggiungiTransazione() {
    if (this.tr.importo <= 0 || this.tr.dettagli.trim() === '' || this.tr.id <= 0) {
      alert('Per favore, inserisci valori validi per tutti i campi.');
      return;
    }else{
    this.dati.aggiungiTransazione(this.tr);
    this.router.navigate(['/movimenti']);
    }
  }
}
