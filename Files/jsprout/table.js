class BigTable
{
    constructor(element, options = {}) {
        console.log(element);
        console.log(options);
    }
}

document.addEventListener('DOMContentLoaded', function(){
    new BigTable(document.querySelector('.bigTable'), {
       filters:  {
            cols: {
                0: 'select'
            }
       }
    });
});