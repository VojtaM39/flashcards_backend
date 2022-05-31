import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import CollectionsRoute from '@routes/collections.route';
import FlashcardsRoute from '@routes/flashcards.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new CollectionsRoute(), new FlashcardsRoute()]);

app.listen();
