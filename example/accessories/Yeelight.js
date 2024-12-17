const co = require('co');
const homekit = require('homekit');
const Yeelight = require('yeelight2');

const Accessory      = homekit.Accessory;
const Service        = homekit.Service;
const Characteristic = homekit.Characteristic;
const UUID           = homekit.uuid;

module.exports = done => co(function*(){

  const yeelight = yield new Promise((accept, reject) => {
    Yeelight.discover(light => accept(light));
  });

  var accessory = new Accessory('Yeelight', UUID.generate(yeelight.id));
  accessory
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, 'Yeelight')
  .setCharacteristic(Characteristic.Model       , 'color')
  .setCharacteristic(Characteristic.SerialNumber, yeelight.id);

  accessory.on('identify', function(paired, callback) {
    console.log('identify');
  });

  accessory
  .addService(Service.Lightbulb, yeelight.name)
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    yeelight.set_power(value).then(x => callback(), callback);
  })
  .on('get', function(callback) {
    callback(null, yeelight.power === 'on');
  });

  done(accessory);

  // accessory
  // .getService(Service.Lightbulb)
  // .addCharacteristic(Characteristic.Brightness)
  // .on('set', function(value, callback) {
  //   LightController.setBrightness(value);
  //   callback();
  // })
  // .on('get', function(callback) {
  //   callback(null, LightController.getBrightness());
  // });

  // // also add an "optional" Characteristic for Saturation
  // accessory
  // .getService(Service.Lightbulb)
  // .addCharacteristic(Characteristic.Saturation)
  // .on('set', function(value, callback) {
  //   LightController.setSaturation(value);
  //   callback();
  // })
  // .on('get', function(callback) {
  //   callback(null, LightController.getSaturation());
  // });

  // // also add an "optional" Characteristic for Hue
  // accessory
  // .getService(Service.Lightbulb)
  // .addCharacteristic(Characteristic.Hue)
  // .on('set', function(value, callback) {
  //   LightController.setHue(value);
  //   callback();
  // })
  // .on('get', function(callback) {
  //   callback(null, LightController.getHue());
  // });


});