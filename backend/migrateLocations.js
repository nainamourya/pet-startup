import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define Sitter schema (minimal version)
const sitterSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
});

const Sitter = mongoose.model('Sitter', sitterSchema);

// Geocoding function
async function geocodeAddress(address) {
  try {
    console.log(`🗺️  Geocoding: ${address}`);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'PetSitter-Migration/1.0'
        }
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      console.log(`❌ Location not found for: ${address}`);
      return null;
    }

    const location = data[0];
    console.log(`✅ Found: [${location.lon}, ${location.lat}]`);
    
    return {
      lon: parseFloat(location.lon),
      lat: parseFloat(location.lat)
    };
  } catch (err) {
    console.error(`❌ Geocoding error for ${address}:`, err.message);
    return null;
  }
}

// Main migration function
async function migrateLocations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all sitters with [0, 0] coordinates
    const sittersWithoutLocation = await Sitter.find({
      'location.coordinates': [0, 0]
    });

    console.log(`\n📍 Found ${sittersWithoutLocation.length} sitters with invalid coordinates\n`);

    if (sittersWithoutLocation.length === 0) {
      console.log('✨ All sitters already have valid coordinates!');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;

    // Process each sitter
    for (const sitter of sittersWithoutLocation) {
      console.log(`\n👤 Processing: ${sitter.name}`);
      
      // Try address first, then city
      const searchAddress = sitter.address || sitter.city;
      
      if (!searchAddress) {
        console.log(`⚠️  No address or city found for ${sitter.name}`);
        failCount++;
        continue;
      }

      const coords = await geocodeAddress(searchAddress);

      if (coords) {
        // Update the sitter
        await Sitter.updateOne(
          { _id: sitter._id },
          {
            $set: {
              'location.type': 'Point',
              'location.coordinates': [coords.lon, coords.lat]
            }
          }
        );
        
        console.log(`✅ Updated ${sitter.name}: [${coords.lon}, ${coords.lat}]`);
        successCount++;
        
        // Respect rate limits (1 request per second for Nominatim)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`❌ Failed to geocode ${sitter.name}`);
        failCount++;
      }
    }

    console.log(`\n📊 Migration complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📍 Total: ${sittersWithoutLocation.length}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

// Run migration
migrateLocations();