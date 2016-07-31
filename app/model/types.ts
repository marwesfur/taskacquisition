export class Task {

    public date: Date;

    constructor(public title = '', public images: Image[] = []) {
        this.date = new Date();
    }

    public addImage(img: Image) {
        this.images = this.images.concat([img]);
    }

    public deleteImage(img: Image) {
        this.images = this.images.filter(_ => _ != img);
    }

    public getFrontImage() {
        return this.images[0];
    }

    public isValid() {
        return !!this.title && this.images.length > 0;
    }
}

export class Image {
    constructor(public src:string, public description = '') {
    }

    public toResourceUrl() {
        return 'data:image/jpeg;base64,' + this.src;
    }
}