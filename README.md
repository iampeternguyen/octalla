# Octalla Project Management

A project manager app that helps you level up your own management skills.

- [Octalla Project Management](#octalla-project-management)
  - [Motivation](#motivation)
  - [Why I built this project this way](#why-i-built-this-project-this-way)
  - [How to navigate this project](#how-to-navigate-this-project)
  - [Key Features](#key-features)
  - [If I had more time](#if-i-had-more-time)
  - [Live Demo](#live-demo)
  - [Install the dependencies](#install-the-dependencies)
    - [Start the app in development mode (hot-code reloading, error reporting, etc.)](#start-the-app-in-development-mode-hot-code-reloading-error-reporting-etc)
    - [Lint the files](#lint-the-files)
    - [Build the app for production](#build-the-app-for-production)

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

## Key Features
- Realtime chat
- Realtime updates for tasks and projects changes 
- Role based CRUD privileges system with protection on front end and backend (firebase)
- Multiple workspaces for users
- Can invite users to workspaces for collaboration

## If I had more time
<<<<<<< HEAD
- Bug fixing (ex: make responsive on different screens)
=======
<<<<<<< HEAD
- Bug fixing (ex: make responsive on different screens)
=======
- Bug fixing 
>>>>>>> 9a0e1dcd96a440d2faa05fa377bdba31f86625e0
>>>>>>> f9c73f20077ce7347ed26fe7a5b6a3e8d8905ff2
- Create tests when Quasar's testing framework is updated for V2
- Develop manager skill tree
  - This would help managers track their learning and development and unlock new features
  - This is going to require a bit of research for not only best practices but user research of people who use other similar apps

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

