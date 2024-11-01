https://stackoverflow.com/questions/51399883/adding-ssl-certs-to-nginx-docker-container

## SSL Certification Initialisation

Created a separate docker container just for the purpose of retreving certificates added by Certbot.

```bash
$ cd letsencrypt && docker-compose up --build
```

Certification initialisation
```bash
$ sudo docker run -it --rm \
    -v /docker-volumes/etc/letsencrypt:/etc/letsencrypt \
    -v /docker-volumes/var/lib/letsencrypt:/var/lib/letsencrypt \
    -v ~/graininsight/letsencrypt/letsencrypt-site:/data/letsencrypt \
    -v "/docker-volumes/var/log/letsencrypt:/var/log/letsencrypt" \
    certbot/certbot \
    certonly --webroot \
    --email devops@grainscan.in --agree-tos --no-eff-email \
    --webroot-path=/data/letsencrypt \
    -d api.grainscan.in
```

Shut down the docker container.

Generate a DH key.
```bash
mkdir dhparam && sudo openssl dhparam -out ~/graininsight/dhparam/dhparam-2048.pem 2048
```

This is required only while setting the project first time. On renewals, just the docker command for Certification initialisation needs to be run again.

## Future Work
Will explore this if need be of a standalone server. Using certbot command interactively gives a lot of options, including the option to auto renew certificates.
The current process requires manual update of certificates.
sudo certbot --nginx -d api.grainscan.in