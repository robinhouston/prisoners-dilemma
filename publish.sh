#!/bin/bash

aws put -v "Content-type: text/html" "x-amz-acl:public-read" \
    s3.boskent.com/prisoners-dilemma/ipd.html ipd.html
