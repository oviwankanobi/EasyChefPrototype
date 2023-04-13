#!/bin/bash
PWD=`pwd`
python3 -m venv venv
source "$PWD/venv/bin/activate"
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py migrate --run-syncdb
# https://stackoverflow.com/questions/6244382/how-to-automate-createsuperuser-on-django
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin@mail.com', '12345678')" | python manage.py shell

cd ../frontend
npm install embla-carousel-react @mantine/carousel
npm install tabler-icons-react
npm i

cd ../
