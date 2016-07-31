import {Page, NavController, NavParams} from 'ionic-angular';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
//import * as atmosphere from 'atmosphere.js';
import 'rxjs/Rx';

//declare var atmosphere: any;

@Page({
  templateUrl: 'build/pages/reko/reko.html',
  //viewProviders: [HTTP_PROVIDERS]
})
export class RekoPage {
  //selectedItem: any;
  //icons: string[];
  //items: Array<{title: string, note: string, icon: string}>;
  //
  //constructor(private http: Http) {
  //
  //  var socket = atmosphere;
  //  var request = {
  //    url: 'http://localhost:8123/dispatcher/openedTask',
  //    contentType: "application/json",
  //    logLevel: 'debug',
  //    transport: 'websocket',
  //    fallbackTransport: 'long-polling',
  //    onOpen: response => {
  //      console.log('Atmosphere connected using ' + response.transport);
  //    },
  //    onMessage: response => {
  //      console.log('onMessage ' + JSON.stringify(response.responseBody));
  //      this.loadTask(response.responseBody);
  //    }
  //  };
  //
  //  var subsocket = socket.subscribe(request);
  //}
  //
  //private task: any;
  //
  //private loadTask(taskId: string) {
  //  this.http.get(`http://localhost:8123/tasks/tasks/${taskId}/documents`)
  //      .map(res => {
  //        return res.json()
  //      })
  //      .subscribe(task => {
  //        this.task = task
  //        var i = 0;
  //      });
  //    //.toPromise()
  //    //.then(response => {
  //    //  var i = 0;
  //    //});
  //}
  //
  //itemTapped(event, item) {
  //  //this.nav.push(ItemDetailsPage, {
  //  //  item: item
  //  //});
  //}
}
