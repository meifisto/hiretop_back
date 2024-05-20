# back-end MTCA

## Before start
### cp env .env;
### edit parameters

## Script for launch
### npm install : for install dependances
### npm run dev : for launch serve

## Base path
### heroku : https://mtca-backend.herokuapp.com/api/v1/
### local : http://localhost:port/api/v1/
## Paths

---
### *users*
---

# path: /admins/login POST
# body:
  email: string.required,
  password: string.required,

# path: /admins/register POST
# body:
  email: string.required,
  password: string.required,
  firstname: string.required,
  lastname: string.required,
  roles: array.required,
  agence: string.optional

# path: /admins/last-form GET
# params:
  userId: string.required,
  formType: string.required,

---
### *inscriptions*
---

# path: /inscriptions/register-file POST
# body:
  objectdata: string.required,
  fileprop: string.required,
  filenumber: number.required,
  filedata0: any.required,
  filedata1: any.optional,
  filedata2: any.optional,
  filedata3: any.optional,
  filedata4: any.optional,

# path: /inscriptions/list GET


# path: /inscriptions/register-agent POST
# body:
  email: string.required,
  password: string.required,
  etablissementId: string.required,
  firstname: string.required,
  lastname: string.required,

---
### *roles*
---

path: /roles/list GET
