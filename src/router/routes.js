import Home from '@/views/Home.vue';
import PersonalChecker from '@/views/PersonalChecker.vue';

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/checker',
    name: 'checker',
    component: PersonalChecker,
  },
];
