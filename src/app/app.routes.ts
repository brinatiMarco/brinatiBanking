import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Prelievo } from './prelievo/prelievo';
import { Deposito } from './deposito/deposito';
import { Conversione } from './conversione/conversione';
import { Movimenti } from './movimenti/movimenti';
import { Account } from './account/account';

export const routes: Routes = [
    { path: "home", component: Home },
    { path: "prelievo", component: Prelievo },
    { path: "deposito", component: Deposito },
    { path: "conversione", component: Conversione },
    { path: "movimenti", component: Movimenti },
    { path: "account", component: Account },
    { path: "**", component: Home }
];
