FROM nginx:trixie-perl
WORKDIR /usr/share/nginx/html
COPY src .
EXPOSE 80