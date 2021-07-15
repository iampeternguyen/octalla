# Octalla Project Management

A project manager app that helps you level up your own management skills.

- [Octalla Project Management](#octalla-project-management)
  - [Motivation](#motivation)
  - [Why I built this project this way](#why-i-built-this-project-this-way)
  - [How to navigate this project](#how-to-navigate-this-project)
  - [Live Demo](#live-demo)
  - [Install the dependencies](#install-the-dependencies)
    - [Start the app in development mode (hot-code reloading, error reporting, etc.)](#start-the-app-in-development-mode-hot-code-reloading-error-reporting-etc)
    - [Lint the files](#lint-the-files)
    - [Build the app for production](#build-the-app-for-production)
    - [Customize the configuration](#customize-the-configuration)

## Motivation
I find that a lot of teams struggle with having a clear system for project management. Mission driven organizations and startups, especially, often struggle with delegating effectively and getting everyone on the same page. There's always so much to do, that creating a good system isn't a priority. People turn to project management apps to make this easier, but they can be overwhelming with all the features available and not a clear way to best implement them. I wanted to create an app that helped managers and teams learn about some models and frameworks that could help guide their project management. Users wouldn't necessarily have to use these exact frameworks, but it would set them up to think about what these frameworks try to solve and how they can learn from that and apply it in their own teams. 

## Why I built this project this way
- I have always loved vue as a front-end framework, but I also wanted to set myself up for deploying Octalla on a variety of platforms. I chose Quasar because it makes getting up and running a bit easier, while providing enough flexibility in the design and functionality of components. 
- I chose not to use vuex because of limited typescript support, and I wanted to learn how to apply typescript principles in a rather large scale project
- I initially build the project to get up and running as fast as possible. Therefore, there was a lot of refactoring around structuring this project. I eventually settled on MVVM architecture. It was something that I enjoyed learning about when I played around with android development, and kind of forgot about. 

## How to navigate this project
- Components are concerned only with displaying data
- App logic and state are in ViewModels
- Communication with databases occur in repositories
- All app events that other parts need to listen to are housed in events/BroadcastEvents.ts

## Live Demo
[Click here to check out the live demo](https://octalla.vercel.app/)


## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://v2.quasar.dev/quasar-cli/quasar-conf-js).
