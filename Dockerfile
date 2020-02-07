# Create a container: docker create -p 4000:4000 --name demisto-web-form-angular demisto-web-form-angular:latest
# Start the conatiner: docker start demisto-web-form-angular
# Stop the container: docker stop demisto-web-form-angular
# Run a temporary container: docker run -p 4000:4000 -ti --rm demisto-web-form-angular:latest

FROM node:latest
ENV DESTDIR /opt/demisto/demisto-web-form-angular
WORKDIR $DESTDIR
ARG IMPORTER_DEBUG
EXPOSE 4000/tcp

COPY dist/ ${DESTDIR}/dist/
COPY server/ ${DESTDIR}/server/
COPY package.json ${DESTDIR}/package.json

RUN \
cd ${DESTDIR} \
&& npm install

WORKDIR ${DESTDIR}/server/src
CMD ["/bin/sh", "-c", "node server.js"]