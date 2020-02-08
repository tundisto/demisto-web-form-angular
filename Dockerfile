# Create a container: docker create -p 4000:4000 --name demisto-web-form-angular tundisto/demisto-web-form-angular:latest
# Start the conatiner: docker start demisto-web-form-angular
# Stop the container: docker stop demisto-web-form-angular
# Run a temporary container: docker run -p 4000:4000 -ti --rm tundisto/demisto-web-form-angular:latest

FROM node:lts-alpine
ENV DSTDIR /opt/demisto/demisto-web-form-angular
WORKDIR $DSTDIR
ARG IMPORTER_DEBUG
EXPOSE 4000/tcp

COPY dist/ ${DSTDIR}/dist/
COPY server/ ${DSTDIR}/server/
COPY package-node.json ${DSTDIR}/package.json

# unset the entrypoint set in the base image
ENTRYPOINT []

RUN \
apk add bash \
&& ln -sf /bin/bash /bin/sh \
&& cd ${DSTDIR} \
&& npm install

WORKDIR ${DSTDIR}/server/src
# a dummy command is needed prior to main command due to bash optimisation which runs exec and replaces the shell, if there is only a single command.  This fixes ctrl-c termination in alpine
CMD ["/bin/sh", "-c", "dummy=0; node server.js"]