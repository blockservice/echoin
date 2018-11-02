#!/bin/bash
set -e

# this script is used in a docker container, don't run it directly.

yum update -y && yum -y install zip wget tar

cd /app
zip "/scripts/echoin_${BUILD_TAG}_centos-7.zip" echoin lib/*
