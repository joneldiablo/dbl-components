#!/bin/bash

find src/js -type f -name "*.scss" -exec sh -c 'file="{}"; cp "$file" "lib/js/${file#src/js/}"' \;
