// [10.4] setup the store
// This file makes it easier to use the store in your app
// without having to determine if you want the development or production store.

import { __PRODUCTION__ } from 'environs';
import prodStore from './configureStore.prod';
import devStore from './configureStore.dev';
export default (__PRODUCTION__ ? prodStore : devStore);
