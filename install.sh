#! /bin/bash

mkdir -p /srv/tiva/{static/key,apps/key} /var/lib/tiva-key
chown tivaweb /var/lib/tiva-key
cp ./static/* /srv/tiva/static/key/
cp ./apps/* /srv/tiva/apps/key/
