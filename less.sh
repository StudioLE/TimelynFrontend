#!/bin/bash

echo "Converting LESS to CSS"
lessc -x /srv/timelyn/frontend/app/css/style.less /srv/timelyn/frontend/app/css/style.css
