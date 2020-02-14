const exec = require('child_process').exec;

module.exports = function (name, message) {
    return new Promise((resolve, reject) => {
        exec('git tag -fa ' + name + ' -m "' + message + '"', function (err, stdout, stderr) {
            if (err) {
                return reject(err)
            }
            return resolve(stdout)
        })
    })
};
