// services/firebase/FirebaseServiceGeneric.ts
import { database } from "../../FirebaseConfig";
import { ref, push, set, update, remove, get, query, orderByChild, equalTo } from "firebase/database";

export class FirebaseServiceGeneric {
  private db = database;

  getReference(path: string) {
    return ref(this.db, path);
  }

  async create(path: string, data: Record<string, any>) {
    const newRef = push(ref(this.db, path));
    await set(newRef, data);
  }

  async update(path: string, id: string, data: Record<string, any>) {
    const recordRef = ref(this.db, `${path}/${id}`);
    await update(recordRef, data);
  }

  async delete(path: string, id: string) {
    const recordRef = ref(this.db, `${path}/${id}`);
    await remove(recordRef);
  }

  async fetch(path: string) {
    const recordRef = ref(this.db, path);
    const snapshot = await get(recordRef);
    return snapshot.exists() ? snapshot.val() : null;
  }

  async getWhere(path: string, field: string, value: string): Promise<Array<Record<string, any>>> {
    const q = query(ref(this.db, path), orderByChild(field), equalTo(value));
    const snapshot = await get(q);

    const result: Array<Record<string, any>> = [];

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const key in data) {
        result.push({ id: key, ...data[key] });
      }
    }

    return result;
  }
}
