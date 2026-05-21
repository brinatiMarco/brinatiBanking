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

  acc: AccountModel = {
    account_id: 0,
    owner_name: '',
    currency: 'EUR',
    balance: 0
  } as AccountModel;

  isLoading = false;

  effettuaAccesso() {
    if (!this.acc.account_id || this.acc.account_id <= 0) {
      alert('Per favore, inserisci un ID account valido.');
      return;
    }

    this.isLoading = true;

    this.dati.checkAccount(this.acc.account_id).subscribe({
      next: (exists: boolean) => {
        if (exists) {
          this.dati.setAccountCorrente(this.acc);
          this.router.navigate(['/home']);
        } else {
          this.isLoading = false;
          alert('Account non trovato. Per favore, inserisci un ID valido.');
        }
      },
      error: (err) => {
        console.error('Errore accesso:', err);
        this.isLoading = false;
        alert('Errore durante l\'accesso. Riprova più tardi.');
      }
    });
  }
}