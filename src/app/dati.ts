import { Injectable } from '@angular/core';
import { Transazione } from '../models/transazioniModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AccountModel } from '../models/accountModel';

@Injectable({
  providedIn: 'root',
})
export class Dati {
  listaTransazioni: Transazione[] = [
    {id: 1, importo: 1000, dettagli: 'Stipendio'},
    {id: 1, importo: -200, dettagli: 'Spesa alimentare'},
    {id: 1, importo: -150, dettagli: 'Abbonamento palestra'}
  ];

  listaAccount: AccountModel[] = [
    {account_id: 1, owner_name: "Mario", currency:"EUR", balance: 1000},
    {account_id: 2, owner_name: "Mario", currency:"EUR", balance: 1000}
  ];

  accountCorrente: AccountModel = {account_id: 0, owner_name: '', currency:'', balance: 0} as AccountModel;

  


  private apiUrl = 'https://bankingapi-production-2687.up.railway.app';

  constructor(private http: HttpClient) {}

  checkAccount(accountId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/accounts/${accountId}/balance`);
  }

  aggiungiTransazione(transazione: Transazione) {
    this.listaTransazioni.push(transazione);
  }
}
