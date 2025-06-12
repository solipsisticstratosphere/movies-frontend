#!/bin/sh
set -e


ROOT_DIR=/usr/share/nginx/html


if [ -z "$API_URL" ]; then
  echo "Warning: API_URL environment variable not set. Using default http://localhost:8000/api/v1"
  API_URL="http://localhost:8000/api/v1"
fi

echo "Setting API URL to: $API_URL"


for file in $(find $ROOT_DIR -type f -name '*.js' -o -name '*.html'); do
  echo "Processing $file ..."

  sed -i "s|__API_URL__|${API_URL}|g" "$file"
done


exec nginx -g 'daemon off;' 