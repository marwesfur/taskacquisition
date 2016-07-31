import {provide} from 'angular2/core';
import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TaskAcquisitionPage} from './pages/taskacquisition/taskacquisition';
import {SettingsPage} from './pages/settings/settings';
import {TargetContainer} from './components/swipe/TargetContainer'
import {SwipeController} from './components/swipe/SwipeController'
import {Tasks} from "./model/services/tasks";
import {Settings} from "./model/services/settings";
import {Localization, RemoteControlledLocalization} from "./model/services/localization";

@App({
  templateUrl: 'build/app.html',
  directives: [TargetContainer],
  providers: [SwipeController, Tasks, Settings, provide(Localization, {useClass: RemoteControlledLocalization})],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
  rootPage: any = TaskAcquisitionPage;
  pages: Array<{title: string; component: any}>;

  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController,
    private settings: Settings // trigger loading settings from local storage
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Störungserfassung', component: TaskAcquisitionPage },
      { title: 'Einstellungen', component: SettingsPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
