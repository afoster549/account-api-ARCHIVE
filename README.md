# Documentation

[Middleware](#Middlware)
- [Validation](#Validation)
- [Auth](#Auth)

## Middleware

### Validation

[Code](https://github.com/afoster549/web-account-api/blob/main/middleware/validation.js)

Validates the data within the body of a request.

Arguments: `data: Object`, `any: Boolean`

Data is the data that should be included in the body, any indicates that only one or more of the items is required.

**Usage**

The example below is for the data agument, it indicates that the body must have a username and password and they must both be strings.

```javascript
{
    "username": {
        type: "string"
    },
    "password": {
        type: "string"
    }
}
```

The example below is the middleware in use, the any argument is set to false meaning both items are required.

```javascript
const express = require("express")
const router = express.Router()
const validation = require("/middleware/validation")

router.use(
    validation({
        "username": {
            type: "string"
        },
        "password": {
            type: "string"
        }
    }, false)
)
```

### Auth

[Code](https://github.com/afoster549/web-account-api/blob/main/middleware/auth.js)

Checks that a user has the correct authentication to make a request. This should be used for protected endpoints

**Usage**

```javascript
const express = require("express")
const router = express.Router()
const auth_mid = require("/middleware/auth")

router.use(auth_mid)
```
