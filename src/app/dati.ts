import { Injectable } from '@angular/core';
import { Transazione } from '../models/transazione';

@Injectable({
  providedIn: 'root',
})
export class Dati {
  listaTransazioni: Transazione[] = [
    {id: 1, importo: 1000, dettagli: 'Stipendio'},
    {id: 1, importo: -200, dettagli: 'Spesa alimentare'},
    {id: 1, importo: -150, dettagli: 'Abbonamento palestra'}
  ];

  aggiungiTransazione(transazione: Transazione) {
    this.listaTransazioni.push(transazione);
  }
}
