/**
 * GPX Data Parser and Processing Utilities
 * Handles GPX file parsing, distance calculations, and data processing
 */

// GPX Data Parser
export function parseGPXData(gpxString) {
  console.log("🔍 Parsing GPX data...");
  
  // Basic GPX XML parsing (simplified for this demo)
  const trackPoints = [];
  let bounds = {
    minLat: Infinity,
    maxLat: -Infinity,
    minLon: Infinity,
    maxLon: -Infinity
  };

  // Extract track points with coordinates and timestamps using regex
  const trkptRegex = /<trkpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>(.*?)<\/trkpt>/gs;
  let match;
  
  while ((match = trkptRegex.exec(gpxString)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    const pointContent = match[3];
    
    const point = { lat, lon };
    
    // Extract time if available
    const timeMatch = pointContent.match(/<time>([^<]*)<\/time>/);
    if (timeMatch) {
      point.time = timeMatch[1];
    }
    
    // Extract elevation if available  
    const eleMatch = pointContent.match(/<ele>([^<]*)<\/ele>/);
    if (eleMatch) {
      point.elevation = parseFloat(eleMatch[1]);
    }
    
    trackPoints.push(point);
    
    // Update bounds
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
    bounds.minLon = Math.min(bounds.minLon, lon);
    bounds.maxLon = Math.max(bounds.maxLon, lon);
  }

  // Fallback: Extract elevations separately if not found in trackpoints
  if (trackPoints.length > 0 && !trackPoints[0].elevation) {
    const eleRegex = /<ele>([^<]*)<\/ele>/g;
    const elevations = [];
    let eleMatch;
    while ((eleMatch = eleRegex.exec(gpxString)) !== null) {
      elevations.push(parseFloat(eleMatch[1]));
    }

    // Combine with elevations if available
    trackPoints.forEach((point, index) => {
      if (elevations[index] !== undefined) {
        point.elevation = elevations[index];
      }
    });
  }

  // Extract just elevations for gain calculation
  const elevations = trackPoints.map(p => p.elevation).filter(e => e !== undefined);

  return {
    trackPoints,
    bounds,
    totalPoints: trackPoints.length,
    distance: calculateDistance(trackPoints),
    elevationGain: calculateElevationGain(elevations),
    hasTimestamps: trackPoints.some(p => p.time),
    hasElevation: trackPoints.some(p => p.elevation)
  };
}

// Calculate total distance between track points
export function calculateDistance(trackPoints) {
  let totalDistance = 0;
  for (let i = 1; i < trackPoints.length; i++) {
    const prev = trackPoints[i - 1];
    const curr = trackPoints[i];
    totalDistance += haversineDistance(prev.lat, prev.lon, curr.lat, curr.lon);
  }
  return totalDistance;
}

// Haversine formula for distance calculation
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate elevation gain
export function calculateElevationGain(elevations) {
  if (!elevations || elevations.length < 2) return 0;
  
  let gain = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0) gain += diff;
  }
  return gain;
}

// Generate fallback training data if GPX loading fails
export function generateFallbackTrainingData() {
  console.log("🏃 Generating fallback training data...");
  
  const trackPoints = [];
  const startLat = 45.7640;
  const startLon = 4.8357; // Lyon, France
  
  // Generate a simple route
  for (let i = 0; i < 100; i++) {
    trackPoints.push({
      lat: startLat + (Math.random() - 0.5) * 0.01,
      lon: startLon + (Math.random() - 0.5) * 0.01,
      elevation: 200 + Math.random() * 100
    });
  }
  
  return {
    trackPoints,
    bounds: {
      minLat: startLat - 0.005,
      maxLat: startLat + 0.005,
      minLon: startLon - 0.005,
      maxLon: startLon + 0.005
    },
    totalPoints: trackPoints.length,
    distance: 5000, // 5km fallback
    elevationGain: 150
  };
}

// Calculate terrain challenge based on elevation changes
export function calculateTerrainChallenge(gpxData) {
  if (!gpxData.trackPoints || gpxData.trackPoints.length < 2) return 0;
  
  let elevationChanges = 0;
  let previousElevation = null;
  
  gpxData.trackPoints.forEach(point => {
    if (point.elevation && previousElevation !== null) {
      elevationChanges += Math.abs(point.elevation - previousElevation);
    }
    if (point.elevation) previousElevation = point.elevation;
  });
  
  // Normalize terrain challenge
  return Math.min(15, elevationChanges / 100);
}

// Extract comprehensive GPX metadata and track information
export function extractComprehensiveGPXData(gpxString) {
  console.log("🔍 Extracting comprehensive GPX data...");
  
  const data = {
    metadata: {},
    tracks: [],
    waypoints: [],
    routes: [],
    extensions: {},
    statistics: {},
    rawData: gpxString.length
  };

  // Extract GPX header and metadata
  const gpxMatch = gpxString.match(/<gpx[^>]*>/);
  if (gpxMatch) {
    const headerAttrs = extractAttributes(gpxMatch[0]);
    data.metadata.version = headerAttrs.version;
    data.metadata.creator = headerAttrs.creator;
    data.metadata.xmlns = headerAttrs.xmlns;
  }

  // Extract metadata block
  const metadataMatch = gpxString.match(/<metadata[^>]*>(.*?)<\/metadata>/s);
  if (metadataMatch) {
    const metadataContent = metadataMatch[1];
    
    // Track name
    const nameMatch = metadataContent.match(/<name[^>]*>([^<]*)<\/name>/);
    if (nameMatch) data.metadata.name = nameMatch[1];
    
    // Description
    const descMatch = metadataContent.match(/<desc[^>]*>([^<]*)<\/desc>/);
    if (descMatch) data.metadata.description = descMatch[1];
    
    // Author info
    const authorMatch = metadataContent.match(/<author[^>]*>(.*?)<\/author>/s);
    if (authorMatch) {
      data.metadata.author = extractAuthorInfo(authorMatch[1]);
    }
    
    // Time
    const timeMatch = metadataContent.match(/<time[^>]*>([^<]*)<\/time>/);
    if (timeMatch) data.metadata.time = new Date(timeMatch[1]);
    
    // Keywords
    const keywordsMatch = metadataContent.match(/<keywords[^>]*>([^<]*)<\/keywords>/);
    if (keywordsMatch) data.metadata.keywords = keywordsMatch[1].split(',').map(k => k.trim());
    
    // Bounds
    const boundsMatch = metadataContent.match(/<bounds[^>]*\/>/);
    if (boundsMatch) {
      data.metadata.bounds = extractAttributes(boundsMatch[0]);
    }
  }

  // Extract tracks
  const trackMatches = gpxString.match(/<trk[^>]*>(.*?)<\/trk>/gs);
  if (trackMatches) {
    trackMatches.forEach((trackMatch, trackIndex) => {
      const track = extractTrackData(trackMatch, trackIndex);
      data.tracks.push(track);
    });
  }

  // Extract waypoints
  const waypointMatches = gpxString.match(/<wpt[^>]*>(.*?)<\/wpt>/gs);
  if (waypointMatches) {
    waypointMatches.forEach((wptMatch, wptIndex) => {
      const waypoint = extractWaypointData(wptMatch, wptIndex);
      data.waypoints.push(waypoint);
    });
  }

  // Extract routes
  const routeMatches = gpxString.match(/<rte[^>]*>(.*?)<\/rte>/gs);
  if (routeMatches) {
    routeMatches.forEach((rteMatch, rteIndex) => {
      const route = extractRouteData(rteMatch, rteIndex);
      data.routes.push(route);
    });
  }

  // Calculate comprehensive statistics
  data.statistics = calculateComprehensiveStatistics(data);

  return data;
}

// Extract attributes from XML tag
function extractAttributes(xmlTag) {
  const attrs = {};
  const attrRegex = /(\w+)=["']([^"']*)["']/g;
  let match;
  while ((match = attrRegex.exec(xmlTag)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

// Extract author information
function extractAuthorInfo(authorContent) {
  const author = {};
  
  const nameMatch = authorContent.match(/<name[^>]*>([^<]*)<\/name>/);
  if (nameMatch) author.name = nameMatch[1];
  
  const emailMatch = authorContent.match(/<email[^>]*id="([^"]*)"[^>]*domain="([^"]*)"[^>]*\/>/);
  if (emailMatch) author.email = `${emailMatch[1]}@${emailMatch[2]}`;
  
  const linkMatch = authorContent.match(/<link[^>]*href="([^"]*)"[^>]*>/);
  if (linkMatch) author.link = linkMatch[1];
  
  return author;
}

// Extract detailed track data
function extractTrackData(trackMatch, trackIndex) {
  const track = {
    index: trackIndex,
    name: null,
    description: null,
    type: null,
    segments: [],
    extensions: {},
    statistics: {}
  };

  // Track metadata
  const nameMatch = trackMatch.match(/<name[^>]*>([^<]*)<\/name>/);
  if (nameMatch) track.name = nameMatch[1];
  
  const descMatch = trackMatch.match(/<desc[^>]*>([^<]*)<\/desc>/);
  if (descMatch) track.description = descMatch[1];
  
  const typeMatch = trackMatch.match(/<type[^>]*>([^<]*)<\/type>/);
  if (typeMatch) track.type = typeMatch[1];

  // Extract track segments
  const segmentMatches = trackMatch.match(/<trkseg[^>]*>(.*?)<\/trkseg>/gs);
  if (segmentMatches) {
    segmentMatches.forEach((segMatch, segIndex) => {
      const segment = extractSegmentData(segMatch, segIndex);
      track.segments.push(segment);
    });
  }

  // Calculate track statistics
  track.statistics = calculateTrackStatistics(track);

  return track;
}

// Extract segment data with all trackpoints
function extractSegmentData(segmentMatch, segmentIndex) {
  const segment = {
    index: segmentIndex,
    trackpoints: [],
    statistics: {}
  };

  // Extract all trackpoints in this segment
  const trkptMatches = segmentMatch.match(/<trkpt[^>]*>(.*?)<\/trkpt>/gs);
  if (trkptMatches) {
    trkptMatches.forEach((trkptMatch, trkptIndex) => {
      const trackpoint = extractTrackpointData(trkptMatch, trkptIndex);
      segment.trackpoints.push(trackpoint);
    });
  }

  // Calculate segment statistics
  segment.statistics = calculateSegmentStatistics(segment.trackpoints);

  return segment;
}

// Extract detailed trackpoint data
function extractTrackpointData(trkptMatch, pointIndex) {
  const trackpoint = {
    index: pointIndex,
    coordinates: {},
    time: null,
    elevation: null,
    extensions: {},
    heartRate: null,
    cadence: null,
    power: null,
    temperature: null
  };

  // Extract coordinates from attributes
  const coordMatch = trkptMatch.match(/<trkpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>/);
  if (coordMatch) {
    trackpoint.coordinates.lat = parseFloat(coordMatch[1]);
    trackpoint.coordinates.lon = parseFloat(coordMatch[2]);
  }

  const content = trkptMatch.match(/<trkpt[^>]*>(.*?)<\/trkpt>/s);
  if (content) {
    const pointContent = content[1];

    // Elevation
    const eleMatch = pointContent.match(/<ele[^>]*>([^<]*)<\/ele>/);
    if (eleMatch) trackpoint.elevation = parseFloat(eleMatch[1]);

    // Time
    const timeMatch = pointContent.match(/<time[^>]*>([^<]*)<\/time>/);
    if (timeMatch) trackpoint.time = new Date(timeMatch[1]);

    // Extensions (Garmin, Strava, etc.)
    const extensionsMatch = pointContent.match(/<extensions[^>]*>(.*?)<\/extensions>/s);
    if (extensionsMatch) {
      const extContent = extensionsMatch[1];
      
      // Heart rate
      const hrMatch = extContent.match(/<.*?hr[^>]*>([^<]*)<\//);
      if (hrMatch) trackpoint.heartRate = parseInt(hrMatch[1]);
      
      // Cadence
      const cadMatch = extContent.match(/<.*?cad[^>]*>([^<]*)<\//);
      if (cadMatch) trackpoint.cadence = parseInt(cadMatch[1]);
      
      // Power
      const powerMatch = extContent.match(/<.*?power[^>]*>([^<]*)<\//);
      if (powerMatch) trackpoint.power = parseInt(powerMatch[1]);
      
      // Temperature
      const tempMatch = extContent.match(/<.*?temp[^>]*>([^<]*)<\//);
      if (tempMatch) trackpoint.temperature = parseFloat(tempMatch[1]);
    }
  }

  return trackpoint;
}

// Extract waypoint data
function extractWaypointData(waypointMatch, waypointIndex) {
  const waypoint = {
    index: waypointIndex,
    coordinates: {},
    name: null,
    description: null,
    symbol: null,
    type: null,
    elevation: null
  };

  // Extract coordinates
  const coordMatch = waypointMatch.match(/<wpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>/);
  if (coordMatch) {
    waypoint.coordinates.lat = parseFloat(coordMatch[1]);
    waypoint.coordinates.lon = parseFloat(coordMatch[2]);
  }

  const content = waypointMatch.match(/<wpt[^>]*>(.*?)<\/wpt>/s);
  if (content) {
    const wptContent = content[1];

    const nameMatch = wptContent.match(/<name[^>]*>([^<]*)<\/name>/);
    if (nameMatch) waypoint.name = nameMatch[1];

    const descMatch = wptContent.match(/<desc[^>]*>([^<]*)<\/desc>/);
    if (descMatch) waypoint.description = descMatch[1];

    const symMatch = wptContent.match(/<sym[^>]*>([^<]*)<\/sym>/);
    if (symMatch) waypoint.symbol = symMatch[1];

    const typeMatch = wptContent.match(/<type[^>]*>([^<]*)<\/type>/);
    if (typeMatch) waypoint.type = typeMatch[1];

    const eleMatch = wptContent.match(/<ele[^>]*>([^<]*)<\/ele>/);
    if (eleMatch) waypoint.elevation = parseFloat(eleMatch[1]);
  }

  return waypoint;
}

// Extract route data
function extractRouteData(routeMatch, routeIndex) {
  const route = {
    index: routeIndex,
    name: null,
    description: null,
    routepoints: []
  };

  const nameMatch = routeMatch.match(/<name[^>]*>([^<]*)<\/name>/);
  if (nameMatch) route.name = nameMatch[1];

  const descMatch = routeMatch.match(/<desc[^>]*>([^<]*)<\/desc>/);
  if (descMatch) route.description = descMatch[1];

  // Extract route points
  const rteptMatches = routeMatch.match(/<rtept[^>]*>(.*?)<\/rtept>/gs);
  if (rteptMatches) {
    rteptMatches.forEach((rteptMatch, rteptIndex) => {
      const routepoint = extractWaypointData(rteptMatch.replace('rtept', 'wpt'), rteptIndex);
      route.routepoints.push(routepoint);
    });
  }

  return route;
}

// Calculate comprehensive statistics for the entire GPX
function calculateComprehensiveStatistics(data) {
  const stats = {
    totalTracks: data.tracks.length,
    totalWaypoints: data.waypoints.length,
    totalRoutes: data.routes.length,
    totalTrackpoints: 0,
    totalDistance: 0,
    totalElevationGain: 0,
    totalElevationLoss: 0,
    totalTime: 0,
    movingTime: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    minElevation: Infinity,
    maxElevation: -Infinity,
    bounds: {
      minLat: Infinity,
      maxLat: -Infinity,
      minLon: Infinity,
      maxLon: -Infinity
    },
    heartRateData: {
      available: false,
      min: null,
      max: null,
      average: null
    },
    powerData: {
      available: false,
      min: null,
      max: null,
      average: null
    },
    cadenceData: {
      available: false,
      min: null,
      max: null,
      average: null
    }
  };

  // Aggregate statistics from all tracks
  data.tracks.forEach(track => {
    if (track.statistics) {
      stats.totalTrackpoints += track.statistics.totalPoints || 0;
      stats.totalDistance += track.statistics.distance || 0;
      stats.totalElevationGain += track.statistics.elevationGain || 0;
      stats.totalElevationLoss += track.statistics.elevationLoss || 0;
      stats.totalTime += track.statistics.totalTime || 0;
      stats.movingTime += track.statistics.movingTime || 0;
      
      if (track.statistics.maxSpeed > stats.maxSpeed) {
        stats.maxSpeed = track.statistics.maxSpeed;
      }
      
      if (track.statistics.minElevation < stats.minElevation) {
        stats.minElevation = track.statistics.minElevation;
      }
      
      if (track.statistics.maxElevation > stats.maxElevation) {
        stats.maxElevation = track.statistics.maxElevation;
      }

      // Update bounds
      if (track.statistics.bounds) {
        stats.bounds.minLat = Math.min(stats.bounds.minLat, track.statistics.bounds.minLat);
        stats.bounds.maxLat = Math.max(stats.bounds.maxLat, track.statistics.bounds.maxLat);
        stats.bounds.minLon = Math.min(stats.bounds.minLon, track.statistics.bounds.minLon);
        stats.bounds.maxLon = Math.max(stats.bounds.maxLon, track.statistics.bounds.maxLon);
      }
    }
  });

  // Calculate average speed
  if (stats.movingTime > 0) {
    stats.averageSpeed = stats.totalDistance / stats.movingTime;
  }

  return stats;
}

// Calculate statistics for a single track
function calculateTrackStatistics(track) {
  const stats = {
    totalPoints: 0,
    distance: 0,
    elevationGain: 0,
    elevationLoss: 0,
    totalTime: 0,
    movingTime: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    minElevation: Infinity,
    maxElevation: -Infinity,
    bounds: {
      minLat: Infinity,
      maxLat: -Infinity,
      minLon: Infinity,
      maxLon: -Infinity
    }
  };

  // Aggregate from all segments
  track.segments.forEach(segment => {
    if (segment.statistics) {
      stats.totalPoints += segment.statistics.totalPoints || 0;
      stats.distance += segment.statistics.distance || 0;
      stats.elevationGain += segment.statistics.elevationGain || 0;
      stats.elevationLoss += segment.statistics.elevationLoss || 0;
      stats.totalTime += segment.statistics.totalTime || 0;
      stats.movingTime += segment.statistics.movingTime || 0;
      
      if (segment.statistics.maxSpeed > stats.maxSpeed) {
        stats.maxSpeed = segment.statistics.maxSpeed;
      }
    }
  });

  return stats;
}

// Calculate statistics for a segment
function calculateSegmentStatistics(trackpoints) {
  const stats = {
    totalPoints: trackpoints.length,
    distance: 0,
    elevationGain: 0,
    elevationLoss: 0,
    totalTime: 0,
    movingTime: 0,
    averageSpeed: 0,
    maxSpeed: 0
  };

  if (trackpoints.length < 2) return stats;

  let previousPoint = trackpoints[0];
  let previousTime = previousPoint.time;
  let previousElevation = previousPoint.elevation;

  for (let i = 1; i < trackpoints.length; i++) {
    const currentPoint = trackpoints[i];
    
    // Calculate distance
    const segmentDistance = haversineDistance(
      previousPoint.coordinates.lat,
      previousPoint.coordinates.lon,
      currentPoint.coordinates.lat,
      currentPoint.coordinates.lon
    );
    stats.distance += segmentDistance;

    // Calculate elevation changes
    if (previousElevation !== null && currentPoint.elevation !== null) {
      const elevDiff = currentPoint.elevation - previousElevation;
      if (elevDiff > 0) {
        stats.elevationGain += elevDiff;
      } else {
        stats.elevationLoss += Math.abs(elevDiff);
      }
      previousElevation = currentPoint.elevation;
    }

    // Calculate time and speed
    if (previousTime && currentPoint.time) {
      const timeDiff = (currentPoint.time - previousTime) / 1000; // seconds
      stats.totalTime += timeDiff;

      if (timeDiff > 0) {
        const speed = segmentDistance / timeDiff;
        if (speed > 0.5) { // Moving threshold
          stats.movingTime += timeDiff;
        }
        if (speed > stats.maxSpeed) {
          stats.maxSpeed = speed;
        }
      }
      previousTime = currentPoint.time;
    }

    previousPoint = currentPoint;
  }

  // Calculate average speed
  if (stats.movingTime > 0) {
    stats.averageSpeed = stats.distance / stats.movingTime;
  }

  return stats;
}

// Calculate advanced track statistics
export function calculateAdvancedStats(trackPoints) {
  if (!trackPoints || trackPoints.length < 2) {
    return {
      avgSpeed: 0,
      maxSpeed: 0,
      totalTime: 0,
      movingTime: 0
    };
  }
  
  let totalTime = 0;
  let movingTime = 0;
  let maxSpeed = 0;
  let speeds = [];
  
  for (let i = 1; i < trackPoints.length; i++) {
    const prev = trackPoints[i - 1];
    const curr = trackPoints[i];
    
    // Calculate time difference if timestamps are available
    if (prev.time && curr.time) {
      const timeDiff = (new Date(curr.time) - new Date(prev.time)) / 1000; // seconds
      totalTime += timeDiff;
      
      if (timeDiff > 0) {
        const distance = haversineDistance(prev.lat, prev.lon, curr.lat, curr.lon);
        const speed = distance / timeDiff; // m/s
        
        speeds.push(speed);
        maxSpeed = Math.max(maxSpeed, speed);
        
        // Only count as moving time if speed > 0.5 m/s (walking pace)
        if (speed > 0.5) {
          movingTime += timeDiff;
        }
      }
    }
  }
  
  const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
  
  return {
    avgSpeed, // m/s
    maxSpeed, // m/s
    totalTime, // seconds
    movingTime, // seconds
    avgSpeedKmh: avgSpeed * 3.6,
    maxSpeedKmh: maxSpeed * 3.6
  };
}

// Legacy function for backward compatibility
export function extractGPXMetadata(gpxString) {
  const metadata = {};
  
  // Extract track name
  const nameMatch = gpxString.match(/<name[^>]*>([^<]*)<\/name>/);
  if (nameMatch) {
    metadata.trackName = nameMatch[1];
  }
  
  // Extract track description
  const descMatch = gpxString.match(/<desc[^>]*>([^<]*)<\/desc>/);
  if (descMatch) {
    metadata.description = descMatch[1];
  }
  
  // Extract creation time
  const timeMatch = gpxString.match(/<time[^>]*>([^<]*)<\/time>/);
  if (timeMatch) {
    metadata.creationTime = new Date(timeMatch[1]);
  }
  
  // Extract creator info
  const creatorMatch = gpxString.match(/creator="([^"]*)"/);
  if (creatorMatch) {
    metadata.creator = creatorMatch[1];
  }
  
  return metadata;
}
