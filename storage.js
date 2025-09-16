
export const Storage = {
  db: null,
  async init(){
    return new Promise((resolve, reject)=>{
      const req = indexedDB.open('CarnetEPS', 1);
      req.onupgradeneeded = (e)=>{
        const db = e.target.result;
        if(!db.objectStoreNames.contains('profile')) db.createObjectStore('profile', { keyPath: 'id' });
        if(!db.objectStoreNames.contains('sessions')){
          const st = db.createObjectStore('sessions', { keyPath: 'id' });
          st.createIndex('by_date','date');
        }
      };
      req.onsuccess = ()=>{ this.db = req.result; resolve(); };
      req.onerror = ()=>reject(req.error);
    });
  },
  async saveProfile(profile){
    const tx = this.db.transaction('profile','readwrite');
    await tx.objectStore('profile').put({ id:'me', ...profile });
    return tx.complete;
  },
  async getProfile(){
    const tx = this.db.transaction('profile','readonly');
    const val = await tx.objectStore('profile').get('me');
    return val || { Nom:'', Prénom:'', Classe:'', Sexe:'', Activité:'Course' };
  },
  async upsertSession(s){
    if(!s.id) s.id = `S-${Date.now()}`;
    const tx = this.db.transaction('sessions','readwrite');
    await tx.objectStore('sessions').put(s);
    return s;
  },
  async listSessions(){
    return new Promise((resolve,reject)=>{
      const tx = this.db.transaction('sessions','readonly');
      const store = tx.objectStore('sessions');
      const res = [];
      store.openCursor().onsuccess = (e)=>{
        const c = e.target.result;
        if(c){ res.push(c.value); c.continue(); } else resolve(res);
      };
      tx.onerror = ()=>reject(tx.error);
    });
  },
  async getSession(id){
    const tx = this.db.transaction('sessions','readonly');
    return tx.objectStore('sessions').get(id);
  },
  async deleteSession(id){
    const tx = this.db.transaction('sessions','readwrite');
    await tx.objectStore('sessions').delete(id);
  }
};
