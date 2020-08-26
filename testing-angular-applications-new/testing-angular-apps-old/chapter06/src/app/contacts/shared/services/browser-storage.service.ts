import { Injectable } from '@angular/core';
import { IContactPreference } from './preferences.service'

// the service needs to persist data. We create a fake service called browser-storage-service
  // it only needs to provide a token and a simple storage interface
@Injectable()
export class BrowserStorage {
  getItem: (property: string) => string | object;
  setItem: (property: string, value: string | object) => void;
}

@Injectable()
export class BrowserStorageAsync {
  getItem: (property: string) => Promise<IContactPreference>;
  setItem: (property: string, value: string | object) => Promise<boolean>;
}
