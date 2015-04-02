#!/bin/bash

echo "Converting LESS to CSS"
lessc -x app/css/style.less app/css/style.css
