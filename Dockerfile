# Use Alpine Linux as base
FROM alpine:3.21.3

# Install Node.js 18.20.8 with musl
ENV NODE_VERSION=18.20.8
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node \
    && apk add --no-cache libstdc++ \
    && apk add --no-cache --virtual .build-deps curl \
    && ARCH= && OPENSSL_ARCH='linux*' \
    && alpineArch="$(apk --print-arch)" \
    && case "${alpineArch##*-}" in \
        x86_64) ARCH='x64' CHECKSUM="2c75d5d562d3ffc049ca1bbea65b68ae6bd0ec50ed04b1f606e065eaf35e8599" OPENSSL_ARCH=linux-x86_64;; \
        x86) OPENSSL_ARCH=linux-elf;; \
        aarch64) OPENSSL_ARCH=linux-aarch64;; \
        arm*) OPENSSL_ARCH=linux-armv4;; \
        ppc64le) OPENSSL_ARCH=linux-ppc64le;; \
        s390x) OPENSSL_ARCH=linux-s390x;; \
        *) ;; \
    esac \
    && if [ -n "${CHECKSUM}" ]; then \
        set -eu; \
        curl -fsSLO --compressed "https://unofficial-builds.nodejs.org/download/release/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz"; \
        echo "$CHECKSUM node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz" | sha256sum -c - \
        && tar -xJf "node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
        && ln -s /usr/local/bin/node /usr/local/bin/nodejs; \
    else \
        echo "Building from source" \
        && apk add --no-cache --virtual .build-deps-full binutils-gold g++ gcc gnupg libgcc linux-headers make python3 py-setuptools \
        && export GNUPGHOME="$(mktemp -d)" \
        && for key in \
            C0D6248439F1D5604AAFFB4021D900FFDB233756 \
            DD792F5973C6DE52C432CBDAC77ABFA00DDBF2B7 \
            CC68F5A3106FF448322E48ED27F5E38D5B0A215F \
            8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
            890C08DB8579162FEE0DF9DB8BEAB4DFCF555EF4 \
            C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
            108F52B48DB57BB0CC439B2997B01419BD92F80A \
            A363A499291CBBC940DD62E41F10027AF002F8B0; do \
            gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "$key" || \
            gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key"; \
        done \
        && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.xz" \
        && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
        && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
        && gpgconf --kill all \
        && rm -rf "$GNUPGHOME" \
        && grep " node-v$NODE_VERSION.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
        && tar -xf "node-v$NODE_VERSION.tar.xz" \
        && cd "node-v$NODE_VERSION" \
        && ./configure \
        && make -j$(getconf _NPROCESSORS_ONLN) V= \
        && make install \
        && apk del .build-deps-full \
        && cd .. \
        && rm -Rf "node-v$NODE_VERSION" \
        && rm "node-v$NODE_VERSION.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt; \
    fi \
    && rm -f "node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz" \
    && find /usr/local/include/node/openssl/archs -mindepth 1 -maxdepth 1 ! -name "$OPENSSL_ARCH" -exec rm -rf {} \; \
    && apk del .build-deps \
    && node --version \
    && npm --version

# Install Yarn
ENV YARN_VERSION=1.22.22
RUN apk add --no-cache --virtual .build-deps-yarn curl gnupg tar \
    && export GNUPGHOME="$(mktemp -d)" \
    && for key in 6A010C5166006599AA17F08146C2130DFD2497F5; do \
        gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "$key" || \
        gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key"; \
    done \
    && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz.asc" \
    && gpg --batch --verify yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
    && gpgconf --kill all \
    && rm -rf "$GNUPGHOME" \
    && mkdir -p /opt \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -s /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -s /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarn \
    && yarn --version \
    && rm -rf /tmp/*

# Copy docker entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node"]

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S weatherapp -u 1001

# Change ownership of app directory
RUN chown -R weatherapp:nodejs /app

# Switch to non-root user
USER weatherapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "start"]
