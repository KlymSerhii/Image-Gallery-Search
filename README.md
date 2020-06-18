## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```
## Some details
1. Node.js version should be higher than `10.13.0`.
2. Application will use 3000 port.
3. To test application use `localhost:3000/search/${searchTerm}`.
4. `api_key` and `refresh_interval` are located in `src/config.json`.
5. I didn't use `.env`, because it'll take more time to review. 
(to create this file, paste `api_key` and `refresh_interval` there etc.)
6. Some improvements may be made to this project, e.g. add some cache 
(like `Redis` or `Aerospike`) and set up `Docker`. But all of this takes 
additional time and 2 hours is not enough for all of this.

