## Swapp-backend

- **Use nodejs framework and can only run node version less than 12.0.0**
 
- **Use mysql database**

- **Use MysqlWorkbench to manage the database, create diagrams and synch models**

## Step config

- Create file local.tom in file config

```

[db]
  [[db.datasources]]
  name                = "default-db"
  access_type         = "password"
  username            = "root"
  password            = "password"
  schema              = "xinxiu_v1"
  [db.datasources.options]
    host              = "mysql"
    timezone          = "+08:00"
    dialect           = "mysql"
    [db.datasources.options.dialectOptions]
      decimalNumbers  = true

[media]
  hostkey		=	"local:filesystem"
  path  		=	"static/.media"
  prefix		=	"http://localhost:8181/static"

[auth]
  prv_key  = "verysecretivesecrete"
  expiry   = 28800
  
[mailer] # request from tech lead
  port      = 465
  user      = ""
  pass      = ""
  host      = ""
  from      = ""

[mail_template]
  password_request      = "./app/resources/mail_template/password_request.pug"
  generic               = "./app/resources/mail_template/generic.pug"

[stripe]
  secret_key      = "sk_test_Y4vHvEcYRqzJmYDqh4R0Wn4E"

[seed]
  run     = true

[[cronjobs]]
  schedule    = "*/15 * * * *" 
  path        = "app/services/lesson" 
  taskname    = "stasis_conclude_slots" 
  run_on_init = true

```
- Edit password, schema, and host by your mysql
- Open MysqlWorkbench Connect the MySQL Servers and choose the database

- In root project open file database/sawpp.mwb with MysqlWorkbench->Click Database > Synchronize With Any Source
- You may choose to save change script into a DB instead of executing it directly.
- Choose the other MySQL production Server and database
- Now you can see the differences between both databases and you can decide whether to synchronize them source to destination or destination to source.

![Example](https://www.optimum7.com/wp-content/uploads/2013/02/Database-Synchronization-and-Revisioning-with-MySQL-4.png)

- Keep in mind that the schema names should be the same for source and destination.
- If they are not the same, generate the EER Diagram to Catalog Tree on the left, “Right Click > Edit Schema” and rename it.
- Next, on the destination database selection window, Workbench will still ask whether or not you want to ignore the renaming. Ignore it; otherwise, it will rename the destination database, too.
