###
 # @Author: starkwang
 # @Contact me: https://shudong.wang/about
 # @Date: 2019-11-25 15:22:35
 # @LastEditors  : starkwang
 # @LastEditTime : 2019-12-23 12:00:25
 # @Description: file content
 ###
#!/bin/bash

#get highest tag number
git fetch --tags
# VERSION=`git tag | tail -1`
VERSION=`git describe --abbrev=0 --tags`

arg1=$1

#replace . with space so can split into an array
VERSION_BITS=(${VERSION//./ })

#get number parts and increase last one by 1
VNUM1=${VERSION_BITS[0]}
VNUM2=${VERSION_BITS[1]}
VNUM3=${VERSION_BITS[2]}
VNUM3=$((VNUM3+1))

#create new tag
NEW_TAG="$VNUM1.$VNUM2.$VNUM3"

echo "Updating $VERSION to $NEW_TAG"

#get current hash and see if it already has a tag
GIT_COMMIT=`git rev-parse HEAD`
NEEDS_TAG=`git describe --contains $GIT_COMMIT`

echo 'hi'.$NEEDS_TAGg
#only tag if no tag already (would be better if the git describe command above could have a silent option)
if [ -z "$NEEDS_TAG" ]; then
    echo "Tagged with $NEW_TAG (Ignoring fatal:cannot describe - this means commit is untagged) "
    git tag $NEW_TAG -m"${arg1}"
    git push --tags
else
    echo "Already a tag on this commit"
fi
