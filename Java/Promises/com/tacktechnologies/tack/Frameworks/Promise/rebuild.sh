#!/bin/bash

# clean
find . | grep -vE "Test|\.sh$|\.$" | xargs rm

# pull in fresh files
cp -r /Users/keegomyneego/Documents/Tack/macaroon/Tack/app/src/main/java/com/tacktechnologies/tack/Frameworks/Promise/* .
