#!/bin/bash

echo "Converting LESS to CSS"
lessc -x /srv/sailstimeline/frontend/app/css/style.less /srv/sailstimeline/frontend/app/css/style.css
