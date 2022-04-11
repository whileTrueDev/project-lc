# Ignore preview builds
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
if [ "$VERCEL_GIT_COMMIT_REF" != "master" ] && [ "$VERCEL_GIT_COMMIT_REF" != "dev" ]; then
    echo "🛑 - Ignoring preview builds"
    exit 0;
fi

# Name of the app to check. Change this to your application name!
APP=$1

# Install @nrwl/workspace in order to run the affected command
yarn
# Run the affected command, comparing latest commit to the one before that
yarn nx affected:apps --plain --base HEAD~1 --head HEAD | grep $APP -q

# Store result of the previous command (grep)
IS_AFFECTED=$?

if [ $IS_AFFECTED -eq 1 ]; then
    echo "🛑 - Build cancelled (No code changes)"
    exit 0
elif [ $IS_AFFECTED -eq 0 ]; then
    echo "✅ - Build can proceed (Code changes exist)"
    exit 1
fi