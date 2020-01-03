const ComputerTypes = {
  mac: {
    name: 'mac',
    friendlyName: 'Mac',
    desktops: [
      'Mac Pro',
      'iMac',
      'Mac Mini'
    ],
    laptops: [
      'MacBook Pro 15"',
      'MacBook Pro 13"',
      'MacBook Air'
    ]
  },
  windows: {
    name: 'windows',
    friendlyName: 'Windows PC',
    desktops: [
      'Dell Tower',
      'Dell Desktop'
    ],
    laptops: [
      'Power Dell Laptop',
      'Standard Dell Laptop'
    ]
  }
};

module.exports = ComputerTypes;