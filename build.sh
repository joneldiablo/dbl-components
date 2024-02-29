#!/bin/bash

# Variable initialization
OTP=""

# Usage function
usage() {
  echo "Usage: $0 [--otp <otp>]"
  exit 1
}

# Argument parsing
while getopts ":-:" opt; do
  case ${opt} in
    - )
      case "${OPTARG}" in
        otp )
          OTP="${!OPTIND}"; OPTIND=$(( $OPTIND + 1 ))
          ;;
        *)
          echo "Invalid option: --${OPTARG}" >&2
          usage
          ;;
      esac
      ;;
    \? )
      echo "Invalid option: -$OPTARG" >&2
      usage
      ;;
    : )
      echo "Option -$OPTARG requires an argument." >&2
      usage
      ;;
  esac
done

##------ Check for uncommitted changes
if git diff-index --quiet HEAD --; then
  echo "No uncommitted changes. Continuing..."
else
  echo "Uncommitted changes detected. Stopping the script."
  exit 1
fi

# Switch to master branch
git checkout master
git merge -

# Update version and capture the new version
new_version=$(node update-version.js)

# Prepare directories
rm -rf ./lib/js/* && mkdir -p lib/js
rm -rf ./lib/css/* && mkdir -p lib/css
rm -rf ./lib/scss/* && mkdir -p lib/scss
cp -r src/scss lib

# Compile with Babel
yarn babel

# Commit with the new version number
git add .
git commit -m "$new_version"
git push origin --all
git tag -a "$new_version" -m "$new_version"
git push origin "$new_version"

# Publish on npm
if [ -n "$OTP" ]; then
  npm publish --otp "$OTP"
else
  npm publish
fi

# Switch back to the previous branch
git checkout -

