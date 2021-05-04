// let getData = (url, cb) => {
//     let xhr = new XMLHttpRequest();
//     // window.ActiveXObject -> new ActiveXObject();
//     xhr.open('GET', url, true);
//     xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4) {
//             if (xhr.status !== 200) {
//                 console.log('error');
//             } else {
//                 cb(xhr.responseText);
//             }
//         }
//     }
// };

const url = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json";
const someMethod = (obj) => { console.log(JSON.parse(obj)); }

const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject(`${xhr.status}: ${xhr.statusText}`);
                }
                else {
                    resolve(xhr.responseText);
                }
            }
        }

        xhr.send();
    });
}

getRequest(url)
    .then(response => someMethod(response))
    .catch(error => console.log(error));