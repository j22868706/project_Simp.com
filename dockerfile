FROM python:3.8-slim

RUN apt-get update
RUN apt-get install -y nginx
RUN mkdir -m 744 -p /etc/letsencrypt
RUN mkdir -m 744 -p /etc/letsencrypt/live
RUN mkdir -m 744 -p /etc/letsencrypt/live/bootcamp.may11th2023.com
RUN rm /etc/nginx/nginx.conf
COPY test.conf /etc/nginx/conf.d/test.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY options-ssl-nginx.conf /etc/letsencrypt/options-ssl-nginx.conf
COPY ssl-dhparams.pem /etc/letsencrypt/ssl-dhparams.pem
COPY ./bootcamp.may11th2023.com/fullchain.pem /etc/letsencrypt/live/bootcamp.may11th2023.com/fullchain.pem
COPY ./bootcamp.may11th2023.com/privkey.pem /etc/letsencrypt/live/bootcamp.may11th2023.com/privkey.pem


WORKDIR /app
COPY ./app/* /app/
RUN mkdir templates
COPY ./app/templates/* /app/templates
RUN mkdir static
COPY ./app/static/* /app/static

RUN apt-get install -y vim
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install  gunicorn

EXPOSE 8080
EXPOSE 443
ADD start.sh /
RUN chmod +x /start.sh
