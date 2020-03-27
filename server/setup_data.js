import setup from './data/setup';

setup()
.then(() => { console.log('Setup Completed.') })
.catch(error => { console.log(error); })
