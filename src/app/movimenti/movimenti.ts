import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dati } from '../dati';
import { Transazione } from '../../models/transazioniModel';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-movimenti',
  imports: [CommonModule],
  templateUrl: './movimenti.html',
  styleUrl: './movimenti.css',
})
export class Movimenti implements OnInit, OnDestroy {

  constructor(private dati: Dati, private router: Router) {}

  tra: Transazione[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Carica subito
    this.caricaMovimenti();

    // Ricarica quando torni sulla rotta /movimenti
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: any) => event.urlAfterRedirects === '/movimenti'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Piccolo delay per assicurarsi che il componente sia pronto
      setTimeout(() => this.caricaMovimenti(), 100);
    });

    // Ricarica quando cambia l'account
    this.dati.accountCorrente$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.caricaMovimenti();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  caricaMovimenti() {
    this.isLoading = true;

    this.dati.getTransazioniAccountCorrente().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (list) => {
        this.tra = list;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento transazioni:', err);
        this.isLoading = false;
      }
    });
  }

  formatData(data?: string): string {
    if (!data) return '-';

    return new Date(data).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}