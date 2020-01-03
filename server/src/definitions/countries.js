const Countries = {
  Canada: {
    zipLabel: 'Postcode',
    stateLabel: 'Province',
    states: [
      { name: 'Alberta', abbreviation: 'AB' },
      { name: 'British Columbia', abbreviation: 'BC' },
      { name: 'Manitoba', abbreviation: 'MB' },
      { name: 'New Brunswick', abbreviation: 'NB' },
      { name: 'Newfoundland and Labrador', abbreviation: 'NL' },
      { name: 'Northwest Territories', abbreviation: 'NT' },
      { name: 'Nova Scotia', abbreviation: 'NS' },
      { name: 'Nunavut', abbreviation: 'NU' },
      { name: 'Ontario', abbreviation: 'ON' },
      { name: 'Prince Edward Island', abbreviation: 'PE' },
      { name: 'Quebec', abbreviation: 'QC' },
      { name: 'Saskatchewan', abbreviation: 'SK' },
      { name: 'Yukon Territory', abbreviation: 'YT' }
    ]
  },
  'United States of America': {
    zipLabel: 'Zip Code',
    stateLabel: 'State',
    states: [
      { name: 'Alaska', abbreviation: 'AK' },
      { name: 'Alabama', abbreviation: 'AL' },
      { name: 'Arkansas', abbreviation: 'AR' },
      { name: 'American Samoa', abbreviation: 'AS' },
      { name: 'Arizona', abbreviation: 'AZ' },
      { name: 'California', abbreviation: 'CA' },
      { name: 'Colorado', abbreviation: 'CO' },
      { name: 'Connecticut', abbreviation: 'CT' },
      { name: 'District of Columbia', abbreviation: 'DC' },
      { name: 'Delaware', abbreviation: 'DE' },
      { name: 'Florida', abbreviation: 'FL' },
      { name: 'Georgia', abbreviation: 'GA' },
      { name: 'Guam', abbreviation: 'GU' },
      { name: 'Hawaii', abbreviation: 'HI' },
      { name: 'Iowa', abbreviation: 'IA' },
      { name: 'Idaho', abbreviation: 'ID' },
      { name: 'Illinois', abbreviation: 'IL' },
      { name: 'Indiana', abbreviation: 'IN' },
      { name: 'Kansas', abbreviation: 'KS' },
      { name: 'Kentucky', abbreviation: 'KY' },
      { name: 'Louisiana', abbreviation: 'LA' },
      { name: 'Massachusetts', abbreviation: 'MA' },
      { name: 'Maryland', abbreviation: 'MD' },
      { name: 'Maine', abbreviation: 'ME' },
      { name: 'Michigan', abbreviation: 'MI' },
      { name: 'Minnesota', abbreviation: 'MN' },
      { name: 'Missouri', abbreviation: 'MO' },
      { name: 'Mississippi', abbreviation: 'MS' },
      { name: 'Montana', abbreviation: 'MT' },
      { name: 'North Carolina', abbreviation: 'NC' },
      { name: 'North Dakota', abbreviation: 'ND' },
      { name: 'Nebraska', abbreviation: 'NE' },
      { name: 'New Hampshire', abbreviation: 'NH' },
      { name: 'New Jersey', abbreviation: 'NJ' },
      { name: 'New Mexico', abbreviation: 'NM' },
      { name: 'Nevada', abbreviation: 'NV' },
      { name: 'New York', abbreviation: 'NY' },
      { name: 'Ohio', abbreviation: 'OH' },
      { name: 'Oklahoma', abbreviation: 'OK' },
      { name: 'Oregon', abbreviation: 'OR' },
      { name: 'Pennsylvania', abbreviation: 'PA' },
      { name: 'Puerto Rico', abbreviation: 'PR' },
      { name: 'Rhode Island', abbreviation: 'RI' },
      { name: 'South Carolina', abbreviation: 'SC' },
      { name: 'South Dakota', abbreviation: 'SD' },
      { name: 'Tennessee', abbreviation: 'TN' },
      { name: 'Texas', abbreviation: 'TX' },
      { name: 'Utah', abbreviation: 'UT' },
      { name: 'Virginia', abbreviation: 'VA' },
      { name: 'Virgin Islands', abbreviation: 'VI' },
      { name: 'Vermont', abbreviation: 'VT' },
      { name: 'Washington', abbreviation: 'WA' },
      { name: 'Wisconsin', abbreviation: 'WI' },
      { name: 'West Virginia', abbreviation: 'WV' },
      { name: 'Wyoming', abbreviation: 'WY' }
    ]
  }
};

Object.keys(Countries).forEach( country => {
  Countries[country].states.forEach( state => {
    state['display'] = `${state.abbreviation} - ${state.name}`;
  });
});

module.exports = Countries;
