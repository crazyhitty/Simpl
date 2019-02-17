# Echo colors
LIGHT_GREEN='\033[1;32m'
NO_COLOR='\033[0m'

# Current epoch timestamp
BUILD_EPOCH_TIMESTAMP="$(date +'%s')"

# Get Latest Commit ID
COMMIT_HASH="$(git log -1 --format="%h" -n 1)"

# Path and name of the zip bundle to be created
RELEASE_ZIP_FILE="releases/simpl-release-bundle-$COMMIT_HASH-$BUILD_EPOCH_TIMESTAMP.zip"

npm run build
mkdir -p releases
zip -r $RELEASE_ZIP_FILE extension/*

echo "${LIGHT_GREEN}\nBundle created at path $RELEASE_ZIP_FILE"