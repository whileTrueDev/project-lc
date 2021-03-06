# Name of the app to check. Change this to your application name!
APP=$1

# Run the affected command, comparing latest commit to the one before that
yarn nx affected:apps --plain --base HEAD~1 HEAD | grep $APP -q

# Store result of the previous command (grep)
IS_AFFECTED=$?

if [ $IS_AFFECTED -eq 1 ]; then
    echo "🛑 - Deploy cancelled because affected changes not exists"
    exit 1
elif [ $IS_AFFECTED -eq 0 ]; then
    echo "✅ - Deploy can proceed"
    exit 0
fi