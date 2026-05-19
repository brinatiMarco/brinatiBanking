import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Dati } from '../dati';
import { AccountModel } from '../../models/accountModel';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {

  constructor(public dati: Dati,
    private router: Router
  ) {}

  acc : AccountModel = {
    account_id: 0,
    owner_name: '',
    currency: 'EUR',
    balance: 0
  } as AccountModel;
  

  effettuaAccesso() {
    for (let account of this.dati.listaAccount) {
      if (this.acc.account_id === account.account_id && this.acc.owner_name.trim() === account.owner_name) {
        this.dati.accountCorrente = account;
        this.router.navigate(['/home']);
        return;
      }
    }
    alert('Account non trovato. Per favore, inserisci un ID e un nome utente valido.');
  }
}
