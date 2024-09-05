git fetch
git pull
docker build --tag vebusapi:latest .
docker stop vebusapi
docker remove vebusapi
docker run -p 3500:3000 -d --name vebusapi --restart unless-stopped vebusapi:latest