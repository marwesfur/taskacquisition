import {OnInit} from 'angular2/core';
import {Page, NavController, NavParams} from 'ionic-angular';
import {Settings} from '../../model/services/settings'
import {TaskAcquisitionPage} from '../taskacquisition/taskacquisition'

@Page({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage implements OnInit {

  public host: string;
  public deviceName: string;

  constructor(private settings: Settings, private nav: NavController) {

  }

  public ngOnInit() {
    this.host = this.settings.getHost();
    this.deviceName = this.settings.getDeviceName();
  }

  public getRemoteControllerUrl() {
    return this.settings.getRemoteControllerUrl(this.host, this.deviceName);
  }

  public getTaskUrl() {
    return this.settings.getTaskUrl(this.host);
  }

  public save() {
    this.settings.setHost(this.host);
    this.settings.setDeviceName(this.deviceName);
    this.nav.setRoot(TaskAcquisitionPage, {});
  }

  public cancel() {
    this.nav.setRoot(TaskAcquisitionPage, {});
  }
}
