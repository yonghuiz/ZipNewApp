/**
 * Created by liuyu on 2017/7/3.
 */

import { Navigation } from 'react-native-navigation';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import { registerScreens } from './components';
import './config';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
//import SplashScreen from 'react-native-splash-screen';







//registerScreens();

export default class AppRoot {
  constructor() {
    this._prepareStart();
  }

  _prepareStart() {

    Navigation.events().registerAppLaunchedListener(async () => {
      registerScreens(store, Provider);
      //  _prepareStart() {
      //do some promise
      storage
        .load({
          key: 'isLogin',
        })
        .then(ret => {
          console.log(ret);
          if (ret) {
            storage
              .load({
                key: 'userInfo',
              })
              .then(ret => {
                userInfo = ret;
                //this.startHaveLogin()
                this.startHaveLogin('zippora');
                // storage.load({
                //     key:'serviceMode'
                // }).then(ret => {
                //     this.startHaveLogin(ret);
                // }).catch(err => {
                //    this.startLogin()
                // });
              })
              .catch(err => {
                this.startLogin();
              });
          } else {
            this.startLogin();
          }
        })
        .catch(err => {
          console.log(err);
          this.startLogin();
        });
    });
  }


  startLogin() {
    Navigation.setRoot({
      root: {
        stack: {
          id: 'Stack.Home',
          children: [
            {
              component: {
                id: 'Login',
                name: 'Login',
              },
            },
          ],
        }
      }
    });

  }

  startHaveLogin(mode) {
    if (mode === 'ziplocker') {
      Navigation.setRoot({
        root: {
          stack: {
            id: 'Stack.Home3',
            children: [
              {
                component: {
                  id: 'ZipLockerHome',
                  name: 'ZipLockerHome',
                },
              },
            ],
          }
        }
      });
      // Navigation.startSingleScreenApp({
      //     screen: {
      //       screen: 'ZipLockerHome',
      //       navigatorStyle: navigatorStyle,
      //     },
      //     drawer: {
      //       left: {
      //         // optional, define if you want a drawer from the left
      //         screen: 'DrawerScreen',
      //       },
      //       style: {
      //         drawerShadow: false,
      //         leftDrawerWidth: 60,
      //         contentOverlayColor: 'rgba(0,0,0,0.25)',
      //       },
      //       disableOpenGesture: false, // optional, can the drawer be opened with a swipe instead of button
      //     },
      //     appStyle: {
      //       orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
      //       hideBackButtonTitle: true,
      //     },
      //   });
    } else {
      Navigation.setRoot({
        root: {
          stack: {
            id: 'Stack.Home2',
            children: [
              {
                component: {
                  id: 'ZipporaHome',
                  name: 'ZipporaHome',
                },
              },
            ],
          }
        }
      });
      //   Navigation.startSingleScreenApp({
      //     screen: {
      //       screen: 'ZipporaHome',
      //       navigatorStyle: navigatorStyle,
      //     },
      //     appStyle: {
      //       orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
      //       hideBackButtonTitle: true,
      //     },
      // drawer: {
      //     left: { // optional, define if you want a drawer from the left
      //         screen: 'DrawerScreen',
      //     },
      //     style: {
      //         drawerShadow: false,
      //         leftDrawerWidth: 60,
      //         contentOverlayColor: 'rgba(0,0,0,0.25)',
      //     },
      //     disableOpenGesture: false // optional, can the drawer be opened with a swipe instead of button
      // },

    }
  }
}