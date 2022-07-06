# sim notes
- 1org with 1000users who each do 1bs every 2 days for 2 years
  - 375mb storage including indexes
  - 1k batch writes
    - took 1hr
    - 12.48rc each and took 5sec


# query cost notes
- 1.14rc findBy org._id (first=11.83rc)
- 29rc get a users balance per org,cat (first=40rc)




1652806294864 - epochMs
0220517115235
YYYMMDDHHMMSS

bdi(>~Y0jkyoFM8gp|aT
5349b4ddd2781d08c09890f3

## orgs
- _id: uuid
- info:
  - name
  - address
  - phone number
  - email
  - taxId
- stripeApiInfo: {}
- categories:{}
  - id
    - name ie. Kiddush Fund, Eruv Fund, New Building Fund
- products:{}
  - id
    - name ie. Basic Kiddush, Delux Kiddush, Basic Member, Gold Member
    - donationCategoryId
    - price
    - recurring ie. daily, monthly, yearly
<!-- 
- stats: {}
  - catId-prodId-2022-01
    - runningIncome
    - dtLastUpdatedSec -->


## users-orgs
- _id: uuid
- userId: userEmail
- orgId:  orgId
- stripeCardInfo: {}
- recurringProductIds: []
- orgLevel: friend, member
- adminLevel: full, manage, audit


## balance-sheet
- _id: uuid
- userId: userEmail
- orgId:  orgId
- cents: 23423
- type: cc, check, cash, gift, money
- dtMs: 1652806294864
- description: 
- categoryId: categoryId
- productId: productId
- inputBy: userEmail
- inputDt: dateSec
- noTaxExemption?: true/false