#/bin/bash
git add .
echo "################ GIT ADD ###############"

git pull origin master
echo "################ GIT PULL ###############"

git commit -m "$1"
echo "################ GIT COMMIT ###############"

git push -u origin master
echo "################ GIT PUSH ###############"