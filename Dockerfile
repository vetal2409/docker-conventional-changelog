FROM node:13.7.0-alpine3.10

MAINTAINER Vitalii Sydorenko <vetal.sydo@gmail.com>

RUN apk update && apk upgrade && \
    apk add --no-cache bash git
RUN npm install -g git-semver-tags conventional-changelog-angular conventional-recommended-bump