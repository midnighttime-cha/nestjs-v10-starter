#/bin/bash
git add .
echo "################ GIT ADD ###############"

git pull origin main
echo "################ GIT PULL ###############"

git commit -m "$1"
echo "################ GIT COMMIT ###############"

git push -u origin main
echo "################ GIT PUSH ###############"