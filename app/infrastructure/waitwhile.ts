import {Page, Alert, NavController, Loading} from 'ionic-angular';

export function waitWhile<T>(nav: NavController, p: Promise<T>): Promise<T> {
    let loading = Loading.create({content: "Wird übertragen"});
    nav.present(loading);
    p.then(() => loading.dismiss(), () => loading.dismiss());
    return p;
}
