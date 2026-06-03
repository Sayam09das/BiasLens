# SSL Setup

Store local development certificates here if you need HTTPS termination in Nginx.

- `certificates/` should remain gitignored
- `dhparam.pem` can be generated with:

```bash
openssl dhparam -out dhparam.pem 2048
```
