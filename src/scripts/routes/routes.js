import AddPage from '../pages/add/add';
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';
import StoryPage from '../pages/story/storyPage';
import HomePage from '../pages/home/home';

const routes = {
  '/add': new AddPage(),
  '/login' : new LoginPage(),
  '/register' : new RegisterPage(),
  '/' : new HomePage(),
  '/story' : new StoryPage(),
};

export default routes;
