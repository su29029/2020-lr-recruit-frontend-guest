#!/bin/bash

npm run build

tar zcvf dist.tar.gz dist/

scp dist.tar.gz $1:$2

ssh root@34.96.225.58 "tar zxvf $2/dist.tar.gz -C $2/dist;rm -rf $2/dist.tar.gz"
