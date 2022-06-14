let vn30Data = new XMLHttpRequest();
vn30Data.open('GET', 'http://localhost:3000/vn30Data', true);
vn30Data.onload = function() {
    if (this.status === 200) {  
        let data = JSON.parse(this.response);
        console.log(data);
    }
}
vn30Data.send();
// let vn30Data = {
//     '2000': [
//         {
//             'ticker': 'AAA',
//             'capital': 1000,
//         },
//         {
//             'ticker': 'BBB',
//             'capital': 5000,
//         },
//         {
//             'ticker': 'CCC',
//             'capital': 9000,
//         },
//         {
//             'ticker': 'AAA',
//             'capital': 1000,
//         },
//         {
//             'ticker': 'BBB',
//             'capital': 5000,
//         },
//         {
//             'ticker': 'CCC',
//             'capital': 9000,
//         }
//     ],
// }