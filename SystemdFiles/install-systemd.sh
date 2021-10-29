#!/bin/bash
# Install a service that always works (no timer file)
BASEDIR=$(cd $(dirname $0); pwd)
cd $BASEDIR
BASEDIR=`dirname $BASEDIR`

sed -i -e "s#%WorkingDirectory%#${BASEDIR}#" *.service
sudo cp -v *.service /etc/systemd/system/
ls -l *.service | awk '{print $9}' | xargs sudo systemctl enable
ls -l *.service | awk '{print $9}' | xargs sudo systemctl start
