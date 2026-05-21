import { Component } from '@angular/core';
import { Transazione } from '../../models/transazioniModel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dati } from '../dati';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposito',
  imports: [FormsModule, CommonModule],
  templateUrl: './deposito.html',
  styleUrl: './deposito.css',
})
export class Deposito {

  constructor(private dati: Dati,
    private router: Router
  ) {}

  tr: Transazione = {
    id: 0,
    importo: 0,
    dettagli: '',
  } as Transazione;

  isLoading = false;

  aggiungiTransazione() {
    if(this.dati.accountCorrente.account_id != 0){

      this.tr.id = this.dati.accountCorrente.account_id;

      if (this.tr.importo <= 0 || this.tr.dettagli.trim() === '') {
        alert('Per favore, inserisci valori validi per tutti i campi.');
        return;
      }else{
        this.isLoading = true;

        this.dati.depositaSuAccountCorrente(this.tr.importo, this.tr.dettagli).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/movimenti']);
          },
          error: (e) => {
            this.isLoading = false;
            alert('Errore durante il deposito, riprova più tardi.');
            console.error(e);
          }
        });
      }
    }else{
      alert('Per favore, accedi al tuo account prima di effettuare un deposito.');
      this.router.navigate(['/login']);
    }
  }
}