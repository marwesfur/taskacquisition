export function put(url: string, formData: FormData): Promise<any> {
    return new Promise<void>((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };
        xhr.open("PUT", url, true);
        xhr.send(formData);
    });
}

export function get(url: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    });
}