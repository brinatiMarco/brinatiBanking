import { Component } from '@angular/core';
import { Transazione } from '../../models/transazioniModel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dati } from '../dati';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prelievo',
  imports: [FormsModule, CommonModule],
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
    dettagli: '',
  } as Transazione;

  isLoading = false; // ← Aggiungi questa variabile

  aggiungiTransazione() {
    if(this.dati.accountCorrente.account_id != 0){


      if (this.tr.importo <= 0 || this.tr.dettagli.trim() === '' ) {
        alert('Per favore, inserisci valori validi per tutti i campi.');
        return;
      }else{
        this.isLoading = true; // ← Attiva loading

        this.dati.prelevaDaAccountCorrente(this.tr.importo, this.tr.dettagli).subscribe({
          next: () => {
            this.isLoading = false; // ← Disattiva loading
            this.router.navigate(['/movimenti']);
          },
          error: (e) => {
            this.isLoading = false; // ← Disattiva loading anche in caso di errore
            if (e.status === 402 || e.status === 400) {
              alert('Saldo insufficiente per effettuare questo prelievo.');
            } else {
              alert('Errore durante il prelievo, riprova più tardi.');
            }
            console.error(e);
          } 
        });
      }
    }else{
      alert('Per favore, accedi al tuo account prima di effettuare un prelievo.');
      this.router.navigate(['/login']);
    }
  }
}