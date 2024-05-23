# Declare
This is a simple setup for quick test, not for a big production team currently.

# How to run 
Of course yarn before everything starts.
```
yarn
```

based on mac os, prepare docker compose
If want to local build `docker-compose-complete-services.yml`, need to adjust memory allocation from default 2gb to at least 6gb.

### With Docker Desktop
Just simply adjust through UI `preference`.

### With colima
```
colima stop
colima start  --memory 6
```
Then, run the docker compose 

```
docker-compose -f docker-compose-complete-services.yml
```

Or, run the shell script to get simple setup from DockerHub, without building locally.

```
deploy.sh
```

# Bypass CORS
1. You cannot run any api call, cause there is CORS issue. (You can check that out in Dev Tool)![image](https://github.com/ShinJustinHolly3317/selfhost-hoppscotch/assets/83599048/0d5fd8de-69da-4780-afd3-d9f61d64ca17)
2. You need to install this Chrome Extension. ![image](https://github.com/ShinJustinHolly3317/selfhost-hoppscotch/assets/83599048/dba54378-7e02-4286-a2f9-c1f18c3b15aa)
3. After that, add current domain in the extensiion. ![image](https://github.com/ShinJustinHolly3317/selfhost-hoppscotch/assets/83599048/c8b494b6-cb0d-4bad-81f3-f3c9ba702c6f)
4. Refresh, and re-run the api call.



# Pipeline Work Flow
![alt text](./doc/image.png)
We pull open source images from DockerHub currently, so there's no build stage now.
# TODO
- api gateway
- add own build content
- tests
- network setting