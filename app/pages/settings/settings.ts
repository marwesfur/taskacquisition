import {OnInit} from 'angular2/core';
import {Page, NavController, NavParams} from 'ionic-angular';
import {Settings} from '../../model/services/settings'
import {TaskAcquisitionPage} from '../taskacquisition/taskacquisition'

@Page({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage implements OnInit {

  public url: string;

  constructor(private settings: Settings, private nav: NavController) {

  }

  public ngOnInit() {
    this.url = this.settings.getUrl();
  }

  public save() {
    this.settings.setUrl(this.url);
    this.nav.setRoot(TaskAcquisitionPage, {});
  }
}
