const Countries = {
  Canada: {
    zipLabel: 'Postcode',
    stateLabel: 'Province',
    states: [
      { value: 'Alberta', abbreviation: 'AB' },
      { value: 'British Columbia', abbreviation: 'BC' },
      { value: 'Manitoba', abbreviation: 'MB' },
      { value: 'New Brunswick', abbreviation: 'NB' },
      { value: 'Newfoundland and Labrador', abbreviation: 'NL' },
      { value: 'Northwest Territories', abbreviation: 'NT' },
      { value: 'Nova Scotia', abbreviation: 'NS' },
      { value: 'Nunavut', abbreviation: 'NU' },
      { value: 'Ontario', abbreviation: 'ON' },
      { value: 'Prince Edward Island', abbreviation: 'PE' },
      { value: 'Quebec', abbreviation: 'QC' },
      { value: 'Saskatchewan', abbreviation: 'SK' },
      { value: 'Yukon Territory', abbreviation: 'YT' }
    ]
  },
  'United States of America': {
    zipLabel: 'Zip Code',
    stateLabel: 'State',
    states: [
      { value: 'Alaska', abbreviation: 'AK' },
      { value: 'Alabama', abbreviation: 'AL' },
      { value: 'Arkansas', abbreviation: 'AR' },
      { value: 'American Samoa', abbreviation: 'AS' },
      { value: 'Arizona', abbreviation: 'AZ' },
      { value: 'California', abbreviation: 'CA' },
      { value: 'Colorado', abbreviation: 'CO' },
      { value: 'Connecticut', abbreviation: 'CT' },
      { value: 'District of Columbia', abbreviation: 'DC' },
      { value: 'Delaware', abbreviation: 'DE' },
      { value: 'Florida', abbreviation: 'FL' },
      { value: 'Georgia', abbreviation: 'GA' },
      { value: 'Guam', abbreviation: 'GU' },
      { value: 'Hawaii', abbreviation: 'HI' },
      { value: 'Iowa', abbreviation: 'IA' },
      { value: 'Idaho', abbreviation: 'ID' },
      { value: 'Illinois', abbreviation: 'IL' },
      { value: 'Indiana', abbreviation: 'IN' },
      { value: 'Kansas', abbreviation: 'KS' },
      { value: 'Kentucky', abbreviation: 'KY' },
      { value: 'Louisiana', abbreviation: 'LA' },
      { value: 'Massachusetts', abbreviation: 'MA' },
      { value: 'Maryland', abbreviation: 'MD' },
      { value: 'Maine', abbreviation: 'ME' },
      { value: 'Michigan', abbreviation: 'MI' },
      { value: 'Minnesota', abbreviation: 'MN' },
      { value: 'Missouri', abbreviation: 'MO' },
      { value: 'Mississippi', abbreviation: 'MS' },
      { value: 'Montana', abbreviation: 'MT' },
      { value: 'North Carolina', abbreviation: 'NC' },
      { value: 'North Dakota', abbreviation: 'ND' },
      { value: 'Nebraska', abbreviation: 'NE' },
      { value: 'New Hampshire', abbreviation: 'NH' },
      { value: 'New Jersey', abbreviation: 'NJ' },
      { value: 'New Mexico', abbreviation: 'NM' },
      { value: 'Nevada', abbreviation: 'NV' },
      { value: 'New York', abbreviation: 'NY' },
      { value: 'Ohio', abbreviation: 'OH' },
      { value: 'Oklahoma', abbreviation: 'OK' },
      { value: 'Oregon', abbreviation: 'OR' },
      { value: 'Pennsylvania', abbreviation: 'PA' },
      { value: 'Puerto Rico', abbreviation: 'PR' },
      { value: 'Rhode Island', abbreviation: 'RI' },
      { value: 'South Carolina', abbreviation: 'SC' },
      { value: 'South Dakota', abbreviation: 'SD' },
      { value: 'Tennessee', abbreviation: 'TN' },
      { value: 'Texas', abbreviation: 'TX' },
      { value: 'Utah', abbreviation: 'UT' },
      { value: 'Virginia', abbreviation: 'VA' },
      { value: 'Virgin Islands', abbreviation: 'VI' },
      { value: 'Vermont', abbreviation: 'VT' },
      { value: 'Washington', abbreviation: 'WA' },
      { value: 'Wisconsin', abbreviation: 'WI' },
      { value: 'West Virginia', abbreviation: 'WV' },
      { value: 'Wyoming', abbreviation: 'WY' }
    ]
  }
};

Object.keys(Countries).forEach( country => {
  Countries[country].states.forEach( state => {
    state['label'] = `${state.abbreviation} - ${state.value}`;
  });
});

module.exports = Countries;
