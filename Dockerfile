FROM hayd/alpine-deno:1.1.1

EXPOSE 5000

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY ./app/deps.ts .
RUN deno cache deps.ts

CMD ["run", "--allow-net", "--allow-env", "main.ts"]
