import express from 'express';
import { getCollection } from '../db';

const router = express.Router();

// Get Investor Properties
router.get('/', async (req, res) => {
  try {
    const propertiesCollection = await getCollection('properties');

    // Fetch approved properties
    const properties = await propertiesCollection
      .find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    // Map properties to include investment data
    // In a real app, this data would likely come from the DB
    // For now, we'll mock it based on property attributes to be consistent
    const investorProperties = properties.map((property, index) => {
      // Generate deterministic pseudo-random values based on property ID
      const seed = property._id.toString().substring(20);
      const randomFactor = parseInt(seed, 16) / 0xffffff;

      const price = property.price || 500000;
      // Ensure a mix of ROIs to get different risk levels
      // Use index to force distribution if random isn't enough
      let baseROI = 5 + (randomFactor * 10);
      if (index % 3 === 0) baseROI = 13; // High risk
      if (index % 3 === 1) baseROI = 6;  // Low risk

      const expectedROI = baseROI.toFixed(1);
      const yearsToBreakeven = (8 + (randomFactor * 5)).toFixed(1); // 8 - 13 years

      let riskLevel = 'Moderate';
      if (Number(expectedROI) >= 12) riskLevel = 'High';
      if (Number(expectedROI) <= 7) riskLevel = 'Low';

      const minInvestment = Math.floor(price * 0.05); // 5% minimum share
      const investors = Math.floor(randomFactor * 50) + 5; // 5 - 55 investors
      const verified = index % 2 === 0; // 50% verified

      return {
        ...property,
        expectedROI: Number(expectedROI),
        riskLevel,
        minInvestment,
        investors,
        yearsToBreakeven: Number(yearsToBreakeven),
        verified
      };
    });

    res.json({
      success: true,
      properties: investorProperties
    });
  } catch (error) {
    console.error('Fetch investor properties error:', error);
    res.status(500).json({ error: 'Failed to fetch investor properties' });
  }
});

export default router;
