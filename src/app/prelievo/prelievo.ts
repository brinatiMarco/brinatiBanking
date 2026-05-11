import { Component } from '@angular/core';
import { Transazione } from '../../models/transazione';
import { FormsModule } from '@angular/forms';
import { Dati } from '../dati';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prelievo',
  imports: [FormsModule],
  templateUrl: './prelievo.html',
  styleUrl: './prelievo.css',
})
export class Prelievo {

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
      this.tr.importo = -Math.abs(this.tr.importo); // Assicurati che l'importo sia negativo per un prelievo
      this.dati.aggiungiTransazione(this.tr);
      this.router.navigate(['/movimenti']);
    }
  }
}
