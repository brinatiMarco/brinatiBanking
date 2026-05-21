import { Injectable } from '@angular/core';
import { Transazione } from '../models/transazioniModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountModel } from '../models/accountModel';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Dati {

  accountCorrente: AccountModel =
   {account_id: 0, owner_name: '', currency:'', balance: 0} as AccountModel; // da cambiare con l'account loggato

  private apiUrl = 'https://bankingapi-production-2687.up.railway.app';

  private accountCorrenteSubject = new BehaviorSubject<AccountModel>(
    {account_id: 0, owner_name: '', currency:'', balance: 0}
  );
  accountCorrente$ = this.accountCorrenteSubject.asObservable();

  constructor(private http: HttpClient) {}

  setAccountCorrente(account: AccountModel) {
    this.accountCorrente = account;
    this.accountCorrenteSubject.next(account);
  }


  checkAccount(accountId: number): Observable<boolean> { 
    const url = `${this.apiUrl}/accounts/${accountId}/balance`;

    return this.http.get(url).pipe(
      map(() => true),
      catchError(err => {
        if (err.status === 404) return of(false);     // account inesistente
        return throwError(() => err);                 // altri errori: propagali
      })
    );
  }




  /* prende le transazioni dell'accountCorrente */
  getTransazioniAccountCorrente(): Observable<Transazione[]> {
    const id = this.accountCorrente?.account_id;
    if (!id) return of([]);
    return this.getTransazioniByAccountId(id);
  }



  


  /* prende tutte le transazioni di un account */
  getTransazioniByAccountId(accountId: number): Observable<Transazione[]> {
    const url = `${this.apiUrl}/accounts/${accountId}/transactions`;

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        const trans = response?.transactions ?? [];

        return trans.map((t: any) => ({
          id: t.id,
          importo: Number(t.amount),          
          dettagli: t.description,
          // ↓ Aggiungi questi campi
          type: t.type,                       // 'deposit' o 'withdrawal'
          created_at: t.created_at,           // data transazione
          balance_after: Number(t.balance_after),  // saldo dopo
          // ↑
        } as Transazione));
      }),
      catchError(err => {
        if (err.status === 404) return of([]);
        return throwError(() => err);
      })
    );
  }




  //deposita sull'account corrente, se è selezionato
  depositaSuAccountCorrente(amount: number, description?: string): Observable<Transazione> {
    const id = this.accountCorrente?.account_id;
    if (!id) return throwError(() => new Error('Nessun account corrente selezionato'));
    return this.deposita(id, amount, description);
  }







  /* funzione deposito  */
  deposita(accountId: number, amount: number, description?: string): Observable<Transazione> {
    const url = `${this.apiUrl}/accounts/${accountId}/deposits`;

    // Body: amount number, description opzionale
    const body: any = { amount };
    if (description && description.trim() !== '') body.description = description.trim();

    return this.http.post<any>(url, body).pipe(
      map((res: any) => {
        // Non sappiamo con certezza la shape della response,
        // quindi gestiamo sia "res" diretto che "res.transaction"
        const t = res?.transaction ?? res;

        const tx: Transazione = {
          id: t?.id ?? 0,
          importo: Number(t?.amount ?? amount),          // amount dovrebbe tornare come number
          dettagli: t?.description ?? description ?? 'Deposito',
        };

        return tx;
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }




  // preleva sull'account corrente, se è selezionato
prelevaDaAccountCorrente(amount: number, description?: string): Observable<Transazione> {
  const id = this.accountCorrente?.account_id;
  if (!id) return throwError(() => new Error('Nessun account corrente selezionato'));
  return this.preleva(id, amount, description);
}





/* funzione prelievo  */
preleva(accountId: number, amount: number, description?: string): Observable<Transazione> {
  const url = `${this.apiUrl}/accounts/${accountId}/withdrawals`;

  const body: any = { amount };
  if (description && description.trim() !== '') body.description = description.trim();

  return this.http.post<any>(url, body).pipe(
    map((res: any) => {
      const t = res?.transaction ?? res;

      const tx: Transazione = {
        id: t?.id ?? 0,
        // nota: l'API ritornerà automaticamente importo negativo per il prelievo
        importo: Number(t?.amount ?? -amount),          
        dettagli: t?.description ?? description ?? 'Prelievo',
      };

      return tx;
    }),
    catchError(err => {
      return throwError(() => err);
    })
  );
}
/* Prende il saldo del conto */
getAccountBalance(accountId: number): Observable<any> {
  const url = `${this.apiUrl}/accounts/${accountId}/balance`;

  return this.http.get<any>(url).pipe(
    catchError(err => {
      if (err.status === 404) return of(null);
      return throwError(() => err);
    })
  );
}

/* Converte il saldo in un'altra valuta */
convertBalance(accountId: number, toCurrency: string): Observable<any> {
  const url = `${this.apiUrl}/accounts/${accountId}/balance/convert/fiat?to=${toCurrency}`;

  return this.http.get<any>(url).pipe(
    catchError(err => {
      console.error('Errore conversione:', err);
      return throwError(() => err);
    })
  );
  }

/* Converte il saldo in cripto */
convertBalanceToCrypto(accountId: number, toCrypto: string): Observable<any> {
  const url = `${this.apiUrl}/accounts/${accountId}/balance/convert/crypto?to=${toCrypto}`;

  return this.http.get<any>(url).pipe(
    catchError(err => {
      console.error('Errore conversione cripto:', err);
      return throwError(() => err);
    })
  );
  }
}
