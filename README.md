# private--shul-admin-server

# Tables

## org
- id
- info
  - name
  - address
  - phone number
  - email
  - taxId
- stripeApiInfo
- donation-categories{}
  - id
  - orgId
  - name ie. Kiddush Fund, Eruv Fund, New Building Fund
  - amountBalance
    - dollar
    - gift

- donation-products{}
  - id
  - orgId
  - name ie. Basic Kiddush, Delux Kiddush, Basic Member, Gold Member
  - donationCategoryId
  - price
  - recurring ie. daily, monthly, yearly
  - ? limitCount
  - ? soldCount


## user-org
- id ie. userId__orgId
- userId ie. email
- orgId
- stripeCardInfo
- oweAggregate
  - lifetime
    - runningDollar
    - runningGift
  - y2022
    - runningDollar
    - runningGift
  - m05
    - runningDollar
    - runningGift
- payAggregate
  - lifetime
    - runningDollar
    - runningGift
  - y2022
    - runningDollar
    - runningGift
  - m05
    - runningDollar
    - runningGift
- recurringProducts
  - ???? maybe this isn't the right place for the recurring stuff
- orgLevel ie. friend, member
- ? orgAdminLevel ie. full, manage, audit

## transaction-ledger
- userId
- orgId
- amount
- type ie. payCC, payCheck, payCash, payGift, oweDollar, oweGift
- date
- description
- donationCategoryId
- donationProductId
- inputtedByUserId
- inputtedDate



# AWS
TODO:
- use the dynamo toolbox: this will help with mapping the key values
- easy adding in dynamodb https://github.com/jeremydaly/dynamodb-toolbox#adding-a-number-to-a-number-attribute
- define tables and setup defs and models

https://www.xolv.io/blog/dev-notes/creating-tables-with-dynamodb-toolbox/

https://github.com/jeremydaly/dynamodb-toolbox

1. https://www.mischianti.org/2021/04/12/dynamodb-prerequisite-and-javascript-sdk-v2-and-v3-1/
2. https://www.mischianti.org/2021/04/19/dynamodb-javascript-sdk-v2-v3-manage-tables-2/
3. https://www.mischianti.org/2021/04/24/dynamodb-javascript-sdk-v2-v3-add-items-with-db-or-documentclient-3/
4. https://www.mischianti.org/2021/04/30/dynamodb-javascript-sdk-v2-v3-manage-items-4/
5. https://www.mischianti.org/2021/05/20/dynamodb-javascript-sdk-v2-v3-scan-table-data-with-pagination-5/
6. https://www.mischianti.org/2021/06/08/dynamodb-javascript-sdk-v2-v3-query-6/

https://dynamodbplace.com/c/nodejs/what-client-library-to-use-aws-sdk-v3

? https://dev.to/rajandmr/creating-apis-with-nodejs-dynamodb-and-aws-lambda-a-better-workflow-with-dynamoose-1l1o

### v3
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html



# Firebase
https://firebase.google.com/docs/database/admin/retrieve-data

https://firebase.google.com/docs/emulator-suite