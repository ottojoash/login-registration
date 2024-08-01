import { Injectable } from '@angular/core';
import * as Realm from 'realm-web';

const app = new Realm.App({ id: 'voyance-ydubnnb' });

@Injectable({
  providedIn: 'root'
})
export class MongoService {
  private mongodb: any = null;

  constructor() {
    if (app.currentUser) {
      this.mongodb = app.currentUser.mongoClient('mongodb-atlas').db('voyance');
    }
  }

  private initializeMongoDB() {
    if (app.currentUser) {
      this.mongodb = app.currentUser.mongoClient('mongodb-atlas').db('voyance');
    }
  }

  async login(email: string, password: string) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    if (user) {
      this.initializeMongoDB();
    }
    return user;
  }

  async register(email: string, password: string, fullName: string, address: string, phoneNumber: string, brn: string, tin: string, data: { email: string; password: string; fullName: any; address: any; phoneNumber: any; brn: any; tin: any; }) {
    await app.emailPasswordAuth.registerUser({ email, password });
    if (!this.mongodb) {
      this.initializeMongoDB();
    }
    const collection = this.mongodb.collection('users');
    await collection.insertOne(data);
  }

  async addGadget(gadget: any) {
    if (!this.mongodb) {
      throw new Error('No MongoDB client available. Make sure you are logged in.');
    }
    const collection = this.mongodb.collection('gadgets');
    await collection.insertOne(gadget);
  }

  async getUser() {
    return app.currentUser;
  }

  async logout() {
    await app.currentUser?.logOut();
    this.mongodb = null;
  }

  async getCollection(collectionName: string) {
    if (!this.mongodb) {
      throw new Error('No MongoDB client available. Make sure you are logged in.');
    }
    return this.mongodb.collection(collectionName);
  }
}
