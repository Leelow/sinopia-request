# Installation

```sh
$ npm install sinopia
$ npm install sinopia-htpasswd
```

## Config

Add to your `config.yaml` (example config):

```yaml
auth:
  request:
    host: localhost
    port: 3000
    method: POST
    adduser_route: /adduser
    authenticate_route: /authenticate
    password_encrypt: sha1
```

Thanks to [@rlidwka](https://github.com/rlidwka) for sinopia project.
