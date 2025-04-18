#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
    echo "Error: Commit message is required."
    echo "Usage: ./git-workflow.sh 'Your commit message here'"
    exit 1
fi

# Run the Git workflow
git add .
git commit -m "$1"
git checkout master
git pull origin master
git merge development
git push origin master
git push origin development
git checkout development
git pull origin master