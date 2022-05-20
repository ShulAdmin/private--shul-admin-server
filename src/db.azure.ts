import mongo = require("mongodb");

class _AzDbCore {
  private dbName = `nonprod`;
  private client: mongo.MongoClient;
  private db: mongo.Db;
  public collection: DB_Collections;


  async initDb() {
    this.client = await mongo.MongoClient.connect("mongodb://shul-admin-db:3a2nxB3baiP6DnL69AUNbrN9i7qWI6ZHwwCVoxAjJ8Eb5ifNASjhgCXj9fuMWU19ZDm0qKcWq3LwP0arsIpNqQ%3D%3D@shul-admin-db.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@shul-admin-db@");
    this.db = this.client.db(this.dbName, { ignoreUndefined: true, });
    this.collection = {
      poc: this.db.collection('poc'),
      orgs: this.db.collection('orgs'),
      users2orgs: this.db.collection('sers-2-orgs'),
      balanceSheet: this.db.collection('balance-sheet'),
    }
  }

  async closeDb() {
    if (this.client) {
      await this.client.close();
    }
  }

  async logLastRUCost() {
    const result = await this.db.command({ getLastRequestStatistics: 1 });
    console.log(`${JSON.stringify(result)}`);
  }

  async insert_org(org: DB_C_Orgs | DB_C_Orgs[]) {
    return this._insert(this.collection.orgs, org);
  }

  async insert_users2orgs(usersOrgs: DB_C_UsersOrgs | DB_C_UsersOrgs[]) {
    return this._insert(this.collection.users2orgs, usersOrgs);
  }

  async insert_balanceSheet(bs: DB_C_BalanceSheet | DB_C_BalanceSheet[]) {
    return this._insert(this.collection.balanceSheet, bs);
  }

  private async _insert<T>(dbCollection: mongo.Collection<mongo.Document>, val: T | T[]) {
    if (Array.isArray(val)) {
      //@ts-ignore
      return dbCollection.insertMany(val, { ordered: false });
    } else {
      //@ts-ignore
      return dbCollection.insertOne(val);
    }
  }

}

export const azdbCore = new _AzDbCore();

interface DB_Collections {
  poc: mongo.Collection<mongo.Document>;
  orgs: mongo.Collection<mongo.Document>;
  users2orgs: mongo.Collection<mongo.Document>;
  balanceSheet: mongo.Collection<mongo.Document>;
}

export class DB_C_BalanceSheet {
  _id: string;

  /** userId */ u: string;
  /** orgId */ o: string;

  /** amount in cents (neg for pledge, pos for payment) */ a: number;
  /** type */ t: DB_C_BalanceSheet_TypeEnum;
  /** dateSec */ d: number;
  /** explanation */ e: string;

  /** categoryId */ c: string;
  /** productId */ p: string;

  /** inputBy */ b: string;
  /** inputDateSec */ n: number;
  /** noTaxExemption */ x?: number | undefined
}


export interface DB_C_UsersOrgs {
  _id: string;

  userId: string;
  orgId: string;
}

export interface DB_C_Orgs {
  /** orgId */ _id: string;

  info: {
    shortName: string;
    legalName?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxInfo?: {
      taxId?: string
    };
  };

  stripeInfo?: {
  };

  categories: DB_El_Category[];

  products: DB_El_Product[];
}

export interface DB_El_Category {
  /** categoryId */ i: string;
  /** name */ n: string,
  /** noTaxExemption */ x?: number | undefined
}

export interface DB_El_Product {
  /** productId */ i: string;
  /** name */ n: string,
  /** amount in cents (neg for pledge, pos for payment) */ a: number;
  /** recurring */ r?: DB_El_Product_RecurringEnum,
  /** categoryId */ c: string;
  /** noTaxExemption */ x?: number | undefined
}

export enum DB_El_Product_RecurringEnum {
  monthly = 'm', yearly = 'y'
}

export enum DB_C_BalanceSheet_TypeEnum {
  cc = 'c', check = 'chk', cash = 'csh', gift = 'g'
}