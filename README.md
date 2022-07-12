# Flashcards example app backend repository
The initial project skeleton has been generated with [typescript-express-starter](https://www.npmjs.com/package/typescript-express-starter) package.

## Application overview
The application was inspired by [Quizlet](https://quizlet.com). It allows users to create their own flashcard collections and then try to memorize them.

## How to run
### Without docker:
```
npm install
npm run dev
```
or 

```
yarn install
yarn run dev
```

### Using docker:
```
mv .env.development.local .env.development.local.nodocker && mv .env.development.local.docker .env.development.local
docker-compose -f docker-compose.development.yml up
```

