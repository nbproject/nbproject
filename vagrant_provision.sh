#!/bin/bash
set -ex 
mkdir -p /milestones

if [[ ! -e nbproject ]]; then
    echo "Can't find nbproject directory. Make sure NFS is installed and running (systemctl status nfs-server)\n If NFS isn't available on your system, disable the nfs option for the sync folder in the Vagrantfile."
    exit 1
fi
   
cd nbproject

MILESTONE=/milestones/prereqs
if [[ ! -e ${MILESTONE} ]]; then
    make prereqs
    touch ${MILESTONE}
fi

MILESTONE=/milestones/prereqs
if [[ ! -e ${MILESTONE} ]]; then    
    a2enmod headers
    apachectl restart
    touch ${MILESTONE}
fi

MILESTONE=/milestones/pip_requirements
if [[ ! -e ${MILESTONE} ]]; then
    pip3 install -r requirements.txt
    touch ${MILESTONE}
fi

MILESTONE=/milestones/npm_install
if [[ ! -e ${MILESTONE} ]]; then
    npm install
    touch ${MILESTONE}
fi

MILESTONE=/milestones/make_django1
if [[ ! -e ${MILESTONE} ]]; then
    make django
    touch ${MILESTONE}
fi
