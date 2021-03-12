# Setup for react app, with django backend, postgres database and node websocket server, served by nginx, through docker-compose.

## 1 - Change ./docker/env files according to project needs

## 2 - Uncomment gitignore (and add your own rules as needed)

## 3 - Move to directory ./docker, build and start containers

```
cd docker
docker-compose up --build -d
```

## 4 - Create django superuser

```
docker-compose run --rm django python manage.py createsuperuser
```

## 5 - Open browser on localhost (http://127.0.0.1/)

## 6 - Upon changes made, rebuild the images

```
docker-compose down --remove-orphans
docker-compose up --build -d
```

## 7 - To see logs, run the command

```
docker-compose logs -f
```

# Production

## 1 - Change environmental variables for production

```
./docker/data/env/production.env
```

## 2 - Create certificates for https

```
./docker/renew-certificate.sh
```

## 3 - Follow same steps as in development, with this change:

All `docker-compose` commands

```
docker-compose up --build -d
```

should be instead `docker-compose -f production.yml`

```
docker-compose -f production.yml up --build -d
```
