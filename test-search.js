const axios = require('axios');

async function testSearch() {
  try {
    console.log('Testing search endpoint...');
    const response = await axios.get('http://localhost:5000/api/properties', {
      params: { 
        location: 'TestLoc',
        listingType: 'sale'
      }
    });
    console.log('Response status:', response.status);
    console.log('Response data properties count:', response.data.properties?.length);
  } catch (error) {
    console.error('Error testing search:', error.message);
  }
}

testSearch();
