# zheye

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

报错：fatal: unable to access 'https://github.com/KaYoczl/zheye.git/': OpenSSL SSL_read: Connection was reset, errno 10054
```
git config --global http.sslVerify "false"
```