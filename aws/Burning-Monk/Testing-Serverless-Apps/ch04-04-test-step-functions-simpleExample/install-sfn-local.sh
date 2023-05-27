#!/bin/bash

echo '-------------------------------------------'
echo 'downloading StepFunctionsLocal.zip...'
echo '-------------------------------------------'

curl -o StepFunctionsLocal.zip https://s3.amazonaws.com/stepfunctionslocal/StepFunctionsLocal.zip

echo '-------------------------------------------'
echo 'unzipping...'
echo '-------------------------------------------'

rm -rf .step-functions-local
unzip StepFunctionsLocal.zip -d .step-functions-local

rm StepFunctionsLocal.zip

echo '-------------------------------------------'
echo 'all done'
echo '-------------------------------------------'