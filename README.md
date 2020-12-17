![NPM](https://img.shields.io/npm/l/db-viewer-component.svg)
![CI](https://github.com/ayeressian/dbgrapher/workflows/CI/badge.svg)

<img src="https://raw.githubusercontent.com/ayeressian/dbgrapher/master/asset/icon-app.svg" alt="drawing" width="200"/>

# DB Grapher
A database schema designing tool that runs in browser. The application URL is [https://dbgrapher.com](https://dbgrapher.com).


## To run
1. Clone the repository.
2. Run "yarn".
3. Create a file with the name env.json in the root directory with the following content.
  ```JSON
  {
    "googleDrive": {
      "developerKey": "",
      "clientId": "",
      "appId": ""
    },
    "oneDrive": {
      "clientId": ""
    }
  }
  ```
4. Run "yarn start". 
