# Echo colors
LIGHT_GREEN='\033[1;32m'
NO_COLOR='\033[0m'

# Get Latest Commit ID
COMMIT_HASH="$(git log -1 --format="%h" -n 1)"

# Name of the zip bundle to be created
RELEASE_ZIP_FILE="simpl-release-bundle-$COMMIT_HASH.zip"

# Build the extension
npm run build

# Enter extension directory
cd extension

# Create zip bundle including all files available in this "extension" directory
zip -r -FS $RELEASE_ZIP_FILE *

# Create releases directory if it doesn't exist in main project directory
mkdir -p ../releases

# Move the created file to releases directory
mv $RELEASE_ZIP_FILE ../releases

echo "${LIGHT_GREEN}\nBundle created at path releases/$RELEASE_ZIP_FILE"