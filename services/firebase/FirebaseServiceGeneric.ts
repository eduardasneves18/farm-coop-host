import { database } from "../../FirebaseConfig";
import {
  ref,
  push,
  set,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
  DataSnapshot,
} from "firebase/database";

export class FirebaseServiceGeneric {
  private db = database;

  getReference(path: string) {
    return ref(this.db, path);
  }

  async create(path: string, data: Record<string, unknown>) {
    const newRef = push(ref(this.db, path));
    await set(newRef, data);
  }

  async update(path: string, id: string, data: Record<string, unknown>) {
    const recordRef = ref(this.db, `${path}/${id}`);
    await update(recordRef, data);
  }

  async delete(path: string, id: string) {
    const recordRef = ref(this.db, `${path}/${id}`);
    await remove(recordRef);
  }

  /**
   * ✅ Corrigido: agora retorna o DataSnapshot completo.
   * Isso permite o uso de .val() e .exists() fora desta função.
   */
  async fetch(path: string): Promise<DataSnapshot> {
    const recordRef = ref(this.db, path);
    return await get(recordRef);
  }

  async getWhere(
    path: string,
    field: string,
    value: string
  ): Promise<Array<Record<string, unknown>>> {
    const q = query(ref(this.db, path), orderByChild(field), equalTo(value));
    const snapshot = await get(q);

    const result: Array<Record<string, unknown>> = [];

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const key in data) {
        result.push({ id: key, ...data[key] });
      }
    }

    return result;
  }
}
