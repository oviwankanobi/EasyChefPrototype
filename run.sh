#!/bin/bash
PWD=`pwd`
source "$PWD/venv/bin/activate"
cd backend
python manage.py runserver &

sleep 5

cd ../frontend
npm i
npm start
cd ..

