import { Component } from '@angular/core';
import { Transazione } from '../../models/transazioniModel';
import { FormsModule } from '@angular/forms';
import { Dati } from '../dati';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prelievo',
  imports: [FormsModule],
  templateUrl: './prelievo.html',
  styleUrl: './prelievo.css',
})
export class Prelievo {

    constructor(private dati: Dati,
    private router: Router,
  ) {}

  tr: Transazione = {
    id: 0,
    importo: 0,
    dettagli: ' ',
  } as Transazione;

  aggiungiTransazione() {
    if(this.dati.accountCorrente.account_id != 0){

      this.tr.id = this.dati.accountCorrente.account_id;

      if (this.tr.importo <= 0 || this.tr.dettagli.trim() === '' ) {
        alert('Per favore, inserisci valori validi per tutti i campi.');
        return;
      }else{    
        this.tr.importo = -Math.abs(this.tr.importo); // Assicurati che l'importo sia negativo per un prelievo
        this.dati.aggiungiTransazione(this.tr);
        this.router.navigate(['/movimenti']);
      }
    }else{
      alert('Per favore, accedi al tuo account prima di effettuare un prelievo.');
    }
  }
}
