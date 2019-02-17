# Current time
BUILD_TIME="$(date +'%s')"

# Get Latest Commit ID
COMMIT_HASH="$(git log -1 --format="%h" -n 1)"

# Name of the zip bundle to be created
RELEASE_ZIP_FILE="../releases/simpl-release-bundle-$COMMIT_HASH-$BUILD_TIME.zip"

npm run build
mkdir -p ../releases
zip $RELEASE_ZIP_FILE ../extension/*

echo "Bundle $RELEASE_ZIP_FILE created in simpl/releases/"