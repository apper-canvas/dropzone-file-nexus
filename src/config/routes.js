import Home from '@/components/pages/Home';

export const routes = {
  home: {
    id: 'home',
    label: 'DropZone',
    path: '/',
    icon: 'Upload',
    component: Home
  }
};

export const routeArray = Object.values(routes);