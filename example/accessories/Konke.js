const co      = require('co');
const homekit = require('homekit');
const KonKe   = require('konke');

const Accessory      = homekit.Accessory;
const Service        = homekit.Service;
const Characteristic = homekit.Characteristic;
const UUID           = homekit.uuid;

const uid = "song940@163.com";
const kid = "a5d13626-c4f8-45c7-8923-6f3562616927";
const tok = "3736a7ab79b27be49345523aab48941b";

const konke = new KonKe({ access_token: tok });

module.exports = done => co(function*(){

  const devices = yield konke.getKList(uid);
  const device = devices.filter(device => device.kid === kid)[0];

  console.log(device);
  
  var outlet = new Accessory(device.device_name, kid);
  outlet.username = device.device_mac;
  outlet.pincode = "123-45-678";

  outlet
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "KonKe")
  .setCharacteristic(Characteristic.Model, device.device_type)
  .setCharacteristic(Characteristic.SerialNumber, kid);

  outlet.on('identify', function(paired, callback) {
    console.log('identify', paired);
    callback();
  });

  outlet
  .addService(Service.Outlet, device.device_name)
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    konke.doSwitchK(uid, kid, value ? 'open' : 'close')
    .then(result => {
      callback(null, result);
    }, callback);
  });

  outlet
  .getService(Service.Outlet)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {
    konke.getKState(uid, kid).then(result => {
      callback(null, result === 'open');
    }, callback);
  });

  done(outlet);

});