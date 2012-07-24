#!/bin/bash

set -e

unset CDPATH
cd "$(dirname "$0")"

for f in *.html
do
    aws put -v "Content-type: text/html" "x-amz-acl:public-read" \
        s3.boskent.com/prisoners-dilemma/"$f" "$f"
done

for f in *.js
do
    aws put -v "Content-type: application/javascript" "x-amz-acl:public-read" \
        s3.boskent.com/prisoners-dilemma/"$f" "$f"
done

for f in *.css
do
    aws put -v "Content-type: text/css" "x-amz-acl:public-read" \
        s3.boskent.com/prisoners-dilemma/"$f" "$f"
done
