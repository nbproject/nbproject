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
    apache2ctl restart
    touch ${MILESTONE}
fi

MILESTONE=/milestones/pip_requirements
if [[ ! -e ${MILESTONE} ]]; then
    su vagrant -c 'pip3 install -r requirements.txt'
    touch ${MILESTONE}
fi

MILESTONE=/milestones/npm_install
if [[ ! -e ${MILESTONE} ]]; then
    su vagrant -c 'npm install'
    touch ${MILESTONE}
fi

MILESTONE=/milestones/make_django1
if [[ ! -e ${MILESTONE} ]]; then
    su vagrant -c 'make django'
    touch ${MILESTONE}
fi

MILESTONE=/milestones/settings_customizations
if [[ ! -e ${MILESTONE} ]]; then
    echo "Make customizations in settings_credentials.py then press ENTER to continue"
    read 
    touch ${MILESTONE}
fi

MILESTONE=/milestones/make_confapache
if [[ ! -e ${MILESTONE} ]]; then
    make confapache
    touch ${MILESTONE}
fi

MILESTONE=/milestones/make_createdirs
if [[ ! -e ${MILESTONE} ]]; then
    make createdirs
    touch ${MILESTONE}
fi

MILESTONE=/milestones/make_rungrunt
if [[ ! -e ${MILESTONE} ]]; then
    su vagrant -c 'make rungrunt'
    touch ${MILESTONE}
fi

apache2ctl restart




