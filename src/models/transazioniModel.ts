export interface Transazione {
  id: number;
  importo: number;
  dettagli: string;
  type?: string;              // 'deposit' o 'withdrawal'
  created_at?: string;        
  balance_after?: number;     
}