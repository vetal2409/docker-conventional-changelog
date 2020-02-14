FROM node:12-alpine

MAINTAINER Vitalii Sydorenko <vetal.sydo@gmail.com>

RUN apk update && apk upgrade && \
    apk add --no-cache bash git
#RUN npm install -g git-semver-tags conventional-changelog-conventionalcommits conventional-recommended-bump
COPY modules/nc-versioning /modules/nc-versioning
RUN cd /modules/nc-versioning && npm install

WORKDIR workdir

ENTRYPOINT ["node","/modules/nc-versioning/cli.js"]