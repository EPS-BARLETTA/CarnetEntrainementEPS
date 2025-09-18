// Simple typed localStorage helpers
export const store = {
  get(key, fallback=null){
    try{ const v = localStorage.getItem(key); return v? JSON.parse(v): fallback; }catch(e){ return fallback }
  },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)); },
  remove(key){ localStorage.removeItem(key); }
};
export const keys = {
  eleve: 'eleve',
  derniereSeance: 'derniereSeance',
  seances: 'seances'
};
