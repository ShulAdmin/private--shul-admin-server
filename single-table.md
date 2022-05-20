
# userInfo per org
PK:userEmail
SK:orgId


# balance-sheet
PK:orgId
SK:userEmail

OR

PK:   BS
SK:  userEmail:Date
LSK:   orgId:Date
