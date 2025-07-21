const os = require('os');

const url = 'http://localhost:3000/home';

if (os.platform() === 'win32') {
  require('child_process').exec(`start ${url}`);
} else if (os.platform() === 'darwin') {
  require('child_process').exec(`open ${url}`);
} else {
  require('child_process').exec(`xdg-open ${url}`);
}