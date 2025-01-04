'use client';

import { openDB, IDBPDatabase } from 'idb';
import { DB_CONFIG } from './config';
import { JobApplicationDB } from './schema';

let dbPromise: Promise<IDBPDatabase<JobApplicationDB>> | null = null;

export async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<JobApplicationDB>(DB_CONFIG.name, DB_CONFIG.version, {
      upgrade(db, oldVersion, newVersion) {
        // Only create store if it doesn't exist
        if (!db.objectStoreNames.contains(DB_CONFIG.stores.applications)) {
          const store = db.createObjectStore(DB_CONFIG.stores.applications, {
            keyPath: 'id',
            autoIncrement: false
          });
          store.createIndex('by-date', 'dateApplied');
        }
      },
      blocked() {
        console.log('Database blocked - please close other tabs');
      },
      blocking() {
        // Close the database to allow the upgrade
        if (dbPromise) {
          dbPromise.then(db => db.close());
          dbPromise = null;
        }
      },
      terminated() {
        console.log('Database terminated');
        dbPromise = null;
      }
    });
  }
  return dbPromise;
}