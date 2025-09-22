#!/bin/sh
set -e

# Allow the script to be run as an arbitrary user
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

exec "$@"