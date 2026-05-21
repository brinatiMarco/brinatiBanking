import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dati } from '../dati';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  constructor(private dati: Dati, private router: Router) {}

  ownerName = '';
  originalBalance = 0;
  convertedBalance = 0;
  originalCurrency = '';
  selectedCurrency = '';
  conversionRate = 1;
  isCrypto = false;
  isLoading = false;
  isConverting = false;

  private destroy$ = new Subject<void>();
  private accountLoaded = false;

  valuteFiat = [
    'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 
    'NZD', 'CNY', 'INR', 'MXN', 'BRL', 'ZAR', 'SGD', 
    'HKD', 'NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 
    'RON', 'BGN', 'HRK', 'RUB', 'TRY', 'ILS', 'AED', 
    'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP',
    'KRW', 'IDR', 'MYR', 'PHP', 'THB', 'VND', 'PKR'
  ];

  valuteCrypto = [
    'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 
    'POLKA', 'LINK', 'AVAX', 'MATIC', 'UNI', 'ATOM', 
    'NEAR', 'FTT', 'SAND', 'MANA', 'GALA', 'FLOW', 'ENJ'
  ];

  get valuteMostrate() {
    return this.isCrypto ? this.valuteCrypto : this.valuteFiat;
  }

  ngOnInit() {
    this.dati.accountCorrente$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.caricaSaldo();
    });

    this.caricaSaldo();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  caricaSaldo() {
    const accountId = this.dati.accountCorrente?.account_id;

    if (!accountId || accountId === 0 || this.accountLoaded) {
      return;
    }

    this.isLoading = true;
    this.accountLoaded = true;

    this.dati.getAccountBalance(accountId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.ownerName = res.owner_name;
        this.originalBalance = Number(res.balance);
        this.originalCurrency = res.currency;
        this.selectedCurrency = res.currency;
        this.convertedBalance = this.originalBalance;
        this.isCrypto = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore caricamento saldo:', err);
        this.isLoading = false;
        this.accountLoaded = false;
      },
    });
  }

  convertiValuta(valuta: string) {
    const accountId = this.dati.accountCorrente?.account_id;

    if (!accountId || valuta === this.originalCurrency) {
      this.selectedCurrency = valuta;
      this.convertedBalance = this.originalBalance;
      this.conversionRate = 1;
      this.isCrypto = false;
      return;
    }

    this.isConverting = true;

    this.dati.convertBalance(accountId, valuta).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.selectedCurrency = res.to_currency;
        this.convertedBalance = Number(res.converted_balance);
        this.conversionRate = Number(res.rate);
        this.isCrypto = false;
        this.isConverting = false;
      },
      error: (err) => {
        console.error('Errore conversione:', err);
        alert('Errore nella conversione della valuta');
        this.isConverting = false;
        this.selectedCurrency = this.originalCurrency;
      },
    });
  }

  convertiCripto(cripto: string) {
    const accountId = this.dati.accountCorrente?.account_id;

    if (!accountId) {
      return;
    }

    this.isConverting = true;

    this.dati.convertBalanceToCrypto(accountId, cripto).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.selectedCurrency = res.to_crypto;
        this.convertedBalance = Number(res.converted_amount);
        this.conversionRate = Number(res.price);
        this.isCrypto = true;
        this.isConverting = false;
      },
      error: (err) => {
        console.error('Errore conversione cripto:', err);
        alert('Errore nella conversione in cripto');
        this.isConverting = false;
        this.selectedCurrency = this.originalCurrency;
        this.isCrypto = false;
      },
    });
  }

  cambiaModalita(modalita: 'fiat' | 'crypto') {
    if (modalita === 'fiat') {
      this.isCrypto = false;
      this.selectedCurrency = this.originalCurrency;
      this.convertedBalance = this.originalBalance;
      this.conversionRate = 1;
    } else {
      this.isCrypto = true;
      this.selectedCurrency = this.valuteCrypto[0];
      this.convertiCripto(this.valuteCrypto[0]);
    }
  }

  navDeposito() {
    this.router.navigate(['/deposito']);
  }

  navPrelievo() {
    this.router.navigate(['/prelievo']);
  }
}