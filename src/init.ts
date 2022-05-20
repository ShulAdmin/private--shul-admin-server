import _ from 'lodash';
import { sub, getUnixTime } from 'date-fns'
import short from 'short-uuid';
const shortUUID = short(`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#%"'()*+-,:;<=>?@[]^_{|}~`, { consistentLength: false });
const humanUUID = short(short.constants.flickrBase58, { consistentLength: false });
import { azdbCore, DB_C_BalanceSheet, DB_C_BalanceSheet_TypeEnum, DB_C_Orgs } from './db.azure';
import { MockData } from './mock-data';



(async () => {
  log("Start script!");
  // log(`productIds`, [...new Array(100)].map(() => humanUUID.generate()));
  try {
    log(`Init DB Connection`, await azdbCore.initDb());

    // await simulate_AddOrgs();

    log(`Drop Collection: balance-sheet`,
      await Promise.allSettled([azdbCore.collection.balanceSheet.drop()])
    );
    await simulate_AddBalanceSheetForOrg(`rkRfnfBu1tqDnpPrcmm7fH`, `gmail.com`);
    await simulate_AddBalanceSheetForOrg(`mvLbBRufusqLmsk3jLT1uh`, `hotmail.com`);

    // await simulateBS_insert();

    // const res = await azdbCore.balanceSheetCollection.distinct('o'); // get distint orgs

    // const res = await azdbCore.balanceSheetCollection.aggregate([
    //   { $match : { o : "5LTQAa5Mxwfc8ug3aA4aF5" } },
    //   { $group: { _id: {userId: "$u", catId: "$c"}, count: { $sum: "$a" } } }
    // ]).toArray();

    // console.log(res);
    // await azdbCore.logLastRUCost();

  } catch (e) {
    console.error(e);
  } finally {
    await azdbCore.closeDb();
  }

  log("End script!");
})();

async function poc() {
  log(`PoC Drop`, await Promise.allSettled([azdbCore.collection.poc.drop()]));

  log(`PoC Insert`,
    await azdbCore.collection.poc.insertOne({
      //@ts-ignore
      _id: ``,
      a: 0
    })
  )
}

async function simulate_AddBalanceSheetForOrg(orgId: string, emailDomain: string = `gmail.com`) {
  //@ts-ignore
  const org: DB_C_Orgs = (await azdbCore.collection.orgs.find({ _id: orgId }).toArray())[0];
  log(`Query for Org ${orgId}`, org);
  await azdbCore.logLastRUCost();

  const todayDate = new Date();
  const inputBys = ['personA', 'personB', 'personC', 'personD', 'personE'];

  let totalCounter = 0;
  async function insertList(bsList: DB_C_BalanceSheet[], iterDt) {
    log(`Insert Up to day=${iterDt} inserting=${bsList.length}`);
    await azdbCore.insert_balanceSheet(bsList);
    log(`Insert Up to day=${iterDt} inserting=${bsList.length}... done.`,
      await azdbCore.logLastRUCost()
    )
  }

  let bsList: DB_C_BalanceSheet[] = [];
  for (let iterDt = 0; iterDt <= 365 * 2; iterDt += 2) {
    const dt = sub(todayDate, { days: iterDt });
    const dtLocalString = dt.toLocaleDateString();
    const dtSec = getUnixTime(dt);

    for (const userIdWithoutEmailAddress of MockData.pop1000BoyGirlNames) {
      const product = _.sample(org.products);
      const bs = {
        _id: shortUUID.generate(),
        /** userId */ u: `${userIdWithoutEmailAddress}@${emailDomain}`,
        /** orgId */ o: orgId,

        /** amount in cents (pos for pledge, neg for payment) */ a: _.random(-product.a, product.a, false),
        /** type */ t: randomEnum(DB_C_BalanceSheet_TypeEnum),
        /** dateSec */ d: dtSec,
        /** explanation */ e: `${userIdWithoutEmailAddress} on ${dtLocalString} got some ${product.n}.`,

        /** categoryId */ c: product.c,
        /** productId */ p: product.i,

        /** inputBy */ b: _.sample(inputBys),
        /** inputDateSec */ n: dtSec,
        /** noTaxExemption */ x: _.random(0, 100, false) >= 5 ? undefined : 1,
      };
      bsList.push(bs);
      totalCounter += 1;
      if (bsList.length >= 1_000) {
        log(`Up to day=${iterDt} total=${totalCounter}`);
        const bsListRef = bsList;
        await insertList(bsListRef, iterDt);
        bsList = [];
      }
    }
  }
  if (bsList.length > 0) {
    const bsListRef = bsList;
    await insertList(bsListRef, 'last');
    bsList = [];
  }
}

async function simulate_AddOrgs() {
  log(`Drop Collection: orgs`,
    await Promise.allSettled([azdbCore.collection.orgs.drop()])
  );

  const orgList: DB_C_Orgs[] = [];
  for (let i = 0; i < MockData.fortune500.length; i++) {
    const shortName = MockData.fortune500[i];
    const org: DB_C_Orgs = {
      _id: humanUUID.generate(),
      info: {
        shortName: shortName,
      },
      categories: [],
      products: [],
    }
    const categoryIdList = [...new Array(_.random(5, 15, false))].map(() => humanUUID.generate());
    categoryIdList.forEach((catId) => {
      org.categories.push({
        i: catId,
        n: `Cat Name for ${catId}`
      });
      const productIdList = [...new Array(_.random(1, 5, false))].map(() => humanUUID.generate());
      productIdList.forEach((prodId) => {
        org.products.push({
          i: prodId,
          n: `Prod Name for ${prodId}`,
          c: catId,
          a: _.random(1_00, 500_00, false)
        })
      });
    });

    orgList.push(org);
  }
  log(`Inserting Orgs: ${orgList.length}`,
    await azdbCore.insert_org(orgList)
  );
  await azdbCore.logLastRUCost();
}

async function simulateBS_insert() {
  const userIds = [`abc@aol.com`, `xyz@gmail.com`, `def@yahoo.com`];
  const orgIds = [`5LTQAa5Mxwfc8ug3aA4aF5`, `aMcbFzKsRwnxAeGUNfBCZQ`, `imJ8XGdsbBJjwMGVHu7dAj`]; // from humanUUID.generate()
  const categoryIds = ['catA', 'catB', 'catC', 'catD', 'catE'];
  const productIds = ['prodA', 'prodB', 'prodC', 'prodD', 'prodE'];
  const inputBys = ['personA', 'personB', 'personC', 'personD', 'personE'];

  for (let i = 0; i < 100_000; i++) {
    const result = await azdbCore.insert_balanceSheet({
      _id: shortUUID.generate(),
      /** userId */ u: _.sample(userIds),
      /** orgId */ o: _.sample(orgIds),

      /** amount in cents (pos for pledge, neg for payment) */ a: _.random(-200, 200, false),
      /** type */ t: randomEnum(DB_C_BalanceSheet_TypeEnum),
      /** dateSec */ d: nowSec(),
      /** explanation */ e: `Bob got the ${i} aliah.`,

      /** categoryId */ c: _.sample(categoryIds),
      /** productId */ p: _.sample(productIds),

      /** inputBy */ b: _.sample(inputBys),
      /** inputDateSec */ n: nowSec(),
      /** noTaxExemption */ x: _.random(0, 1, false) ? undefined : 1,
    });
    console.log(result);
    // await azdbCore.logLastRUCost();
  }
}

function nowSec() {
  return Math.round(Date.now() / 1000.0);
}

function log(text: string, data?: any) {
  console.log(`${new Date().toLocaleString()}: ${text}`);
  if (data !== undefined) {
    console.log(data);
    console.log(`-----------------------`);
  }
}

function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue;
}
