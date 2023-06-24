# Fast Track

Your Dora4 metrics off-the-shelf

![Architecture](https://github.com/garydmcdowellperso/fast-track/blob/main/Architecture.png?raw=true)

# Local development (WIP)

You will need to run locally a mongodb and a redpanda streaming system (this is a lightweight kafka and is compatible with existing kafka clients)(https://www.mongodb.com/, https://redpanda.com/)

To create the mongodb:

`docker run -d --name my_mongo -p27017:27017 mongo`

The routes are being converted to use the redpanda streaming service than to implement the logic directly. This means, request is received, an event created and then it is consumed by a function that deals with it. This will allow the structured monolith approach to be broken into micro services should the need arises and decouples things a bit (see later).

In any case, before being able to use the system you also need to deploy redpanda locally:

`docker run -D --pull=always --name=redpanda-1 --rm -p 9092:9092 -p 9644:9644 docker.vectorized.io/vectorized/redpanda:latest redpanda start --overprovisioned --smp 1  --memory 512M --reserve-memory 0M --node-id 0 --check=false`


You can then setup your database (create the collectons and sequences for the data)

`node apps/back/infra/setupDB.js local`

and then seed it with some sample data:

`node apps/back/infra/seedDB.js local`

Eventually the local can be changed for prod (you get the idea)

Everything is held in a monorepo using turborepo (https://turborepo.org/)

So you should be able to just fire things up first getting the correct node version (choose volta if you prefer)

`nvm use` or `nvm i`

Then installing at the top level the deps:

`npm i`

You can now start things up with:

`npm run dev` 

and Turbo repo will start all projects under apps - under the hood it merely calls the same name script in each app directory

You can navigate to the UI with:

`http://localhost:3000`

The backend is running on:

`http://localhost:5000`

If you want to reset the data at any point you can re-run seedDB

# The front (fe)

Is a classic nextjs React app (https://nextjs.org/) and is using the mantine UI library (https://mantine.dev/). It's work in progress and will look to add swr (https://swr.vercel.app/) and possibly vitest (https://vitest.dev/)

Turborepo has close links with Vercel and therefore NextJS, so the ecosystem is good at caching things and deciding only on what to build. If you register a free account with Vercel it can handle all this pretty seemlessly (instructions here: https://turborepo.org/docs/features/remote-caching)


# The back (back)

This is a classic nodejs application using fastify was a web framework - it needs a bit more TLC as it's using babel-node and that can be dropped completely for ES6 now.

It's built in a 'standard' structured monolith according to clean architecture where dependencies are injected into the lowest levels of code rather than being split everywhere and essentially you 'arrive' via a transport layer - in this case HTTP(s) the command is either directly dropped onto an event stream or picked and / or picked up by the controller being called (and / or because this is WIP).

The idea behind using events is so that it can leverage the idea of event sourcing and we get the true state of anything by reducing down the events to the current or potentially any 'point of time' state we wish.

All requests are hashed to have a signature and promote idempotency so the same command is not repeated but has the same net affect e.g. if the message received is identical to something previously done, respond just with ok, don't process it.

Some of the data is not event sourced like the definition of contributors (people who are doing the work), projects (which are arbitrarily the github repos), teams (which is again an arbitrary collection of contributors). These are genereated from the events received

# Webhooks

The system works off the principle of receiving incoming pushed information from webhooks. It seems that most modern platforms for ticket management, source control and error reporting support this mechanism and it also reduces the need to learn each and every API in order to pull this information.

The down side is of course you have no historic data, it starts receiving from the moment you start pushing so it's entirely possible to not have complete data e.g. you received the merge request or pull request but never saw the ticket 'being started'

# Pluggable

The idea is that if should be pretty straight forward to add any new source to the project, standard things like Jira, github and gitlab are already present and in my particular case I've added Rollbar as an error reporting system for tracking change rate failures. There remains the outstanding implementation of mean time to restore!

# How it works

Currently the setup is that a Jira ticket moving into a status of `In Progress` triggers the idea of work commencing. It's from this point that you can start counting until it's in production and therefore the lead time to complete metric.

With the idea of a project, you might want to change this start state to something that fits your Jira setup or even flag the first push to github / gitlab as being work started. Personally if you use the github push I think you've missed actually the real start point of the work!

Later we can break down this process further as we receive events for each push to the repo and when the mr / pr is requested and finally when merged. So if we want to know the time taken in overall dev, we've got it. If we want to know how long the mr / pr was waiting for review and acceptance, we've got it.

The final piece of a project setup should be detecting the release to production. Currently this is the merge into main / master but it does not account for the CI / CD pipeline duration or even if that failed. A better measure will be to configure the project to say - in this case we assume merged = deployed to prod BUT we should also provide a new webhook so that any CI / CD itself can flag it's completed successfully as the 'correct way' - again this can / should be configurable to provide some flexibility and route to adoption.

The change rate failure is interesting and this is where the project part comes in. It relies on an error reporting system flagging the 'project' as they typically don't know anything about commits or Jira, so you need a way to track back an error to the 'last deployed thing for this project' - hence the use of projects.

# Garbage in / Garbage out

Now, if you don't do things in a 'standard' way, any system for Dora4 will fall apart - here's the rub!

Firstly, the ticket number should be in the branch name you create for the work - you're not doing that, we don't have the links.
Next, your commit messages should contain that branch name - this is a standard commitlint husky task we use in the dash but not everywhere. Otherwise you don't have the links.

All of this suggests that we should be trying to bring some standards of usage into line without hitting teams over the head with red-tape or telling them how to do their work.

# TODO

Oh my the list is very long and winding!