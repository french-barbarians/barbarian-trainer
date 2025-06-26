/**
 * LLM Data Preparation Utilities
 * Prepares comprehensive training data for LLM analysis
 */

// Create comprehensive LLM-ready data structure from dual GPX data
export function prepareLLMTrainingData(gpxData1, gpxData2, combinedGPXData, advancedStats1, advancedStats2, comprehensiveGPXData1, comprehensiveGPXData2) {
    const sessionId = `dual-training-${Date.now()}`;
    const timestamp = new Date().toISOString();

    return {
        // Session metadata
        session: {
            id: sessionId,
            timestamp,
            type: "dual-gpx-analysis",
            filesProcessed: 2,
            dataSource: "Protected GPX Files"
        },

        // Individual file analysis
        tracks: {
            track1: {
            name: comprehensiveGPXData1.metadata.name || "Track 1",
            creator: comprehensiveGPXData1.metadata.creator,
            trackpoints: comprehensiveGPXData1.statistics.totalTrackpoints,
            distance: {
                total_km: (comprehensiveGPXData1.statistics.totalDistance / 1000).toFixed(2),
                total_meters: comprehensiveGPXData1.statistics.totalDistance
            },
            elevation: {
                gain_meters: comprehensiveGPXData1.statistics.totalElevationGain.toFixed(0),
                loss_meters: comprehensiveGPXData1.statistics.totalElevationLoss?.toFixed(0) || "0",
                min_meters: comprehensiveGPXData1.statistics.minElevation?.toFixed(0) || "N/A",
                max_meters: comprehensiveGPXData1.statistics.maxElevation?.toFixed(0) || "N/A"
            },
            performance: {
                avg_speed_kmh: (comprehensiveGPXData1.statistics.averageSpeed * 3.6).toFixed(1),
                max_speed_kmh: (comprehensiveGPXData1.statistics.maxSpeed * 3.6).toFixed(1),
                moving_time_minutes: (comprehensiveGPXData1.statistics.movingTime / 60).toFixed(1),
                total_time_minutes: (comprehensiveGPXData1.statistics.totalTime / 60).toFixed(1)
            },
            advanced_stats: advancedStats1
            },
            
            track2: {
            name: comprehensiveGPXData2.metadata.name || "Track 2",
            creator: comprehensiveGPXData2.metadata.creator,
            trackpoints: comprehensiveGPXData2.statistics.totalTrackpoints,
            distance: {
                total_km: (comprehensiveGPXData2.statistics.totalDistance / 1000).toFixed(2),
                total_meters: comprehensiveGPXData2.statistics.totalDistance
            },
            elevation: {
                gain_meters: comprehensiveGPXData2.statistics.totalElevationGain.toFixed(0),
                loss_meters: comprehensiveGPXData2.statistics.totalElevationLoss?.toFixed(0) || "0",
                min_meters: comprehensiveGPXData2.statistics.minElevation?.toFixed(0) || "N/A",
                max_meters: comprehensiveGPXData2.statistics.maxElevation?.toFixed(0) || "N/A"
            },
            performance: {
                avg_speed_kmh: (comprehensiveGPXData2.statistics.averageSpeed * 3.6).toFixed(1),
                max_speed_kmh: (comprehensiveGPXData2.statistics.maxSpeed * 3.6).toFixed(1),
                moving_time_minutes: (comprehensiveGPXData2.statistics.movingTime / 60).toFixed(1),
                total_time_minutes: (comprehensiveGPXData2.statistics.totalTime / 60).toFixed(1)
            },
            advanced_stats: advancedStats2
            }
        },

        // Combined session analysis
        combined_analysis: {
            totals: {
            distance_km: (combinedGPXData.distance / 1000).toFixed(2),
            elevation_gain_m: combinedGPXData.elevationGain.toFixed(0),
            trackpoints: combinedGPXData.trackPoints.length,
            moving_time_minutes: (combinedGPXData.movingTime / 60).toFixed(1)
            },
            averages: {
            speed_kmh: ((advancedStats1.avgSpeedKmh + advancedStats2.avgSpeedKmh) / 2).toFixed(1),
            max_speed_kmh: Math.max(advancedStats1.maxSpeedKmh, advancedStats2.maxSpeedKmh).toFixed(1)
            },
            bounds: {
            geographic_coverage: {
                north: combinedGPXData.bounds.maxLat.toFixed(6),
                south: combinedGPXData.bounds.minLat.toFixed(6),
                east: combinedGPXData.bounds.maxLon.toFixed(6),
                west: combinedGPXData.bounds.minLon.toFixed(6)
            }
            }
        },

        training_analysis: {
            status: "Basic training analysis",
            endurance_level: determineBasicEnduranceLevel(combinedGPXData.distance / 1000)
        },

        // Data quality indicators
        data_quality: {
            has_timestamps: gpxData1.hasTimestamps || gpxData2.hasTimestamps,
            has_elevation: gpxData1.hasElevation || gpxData2.hasElevation,
            track1_completeness: calculateTrackCompleteness(comprehensiveGPXData1),
            track2_completeness: calculateTrackCompleteness(comprehensiveGPXData2)
        },

        // LLM-ready formatted summary
        summary_for_llm: generateLLMSummary(
            combinedGPXData, 
            advancedStats1, 
            advancedStats2, 
            comprehensiveGPXData1, 
            comprehensiveGPXData2, 
        )
    };
}

// Calculate track data completeness percentage
function calculateTrackCompleteness(comprehensiveGPXData) {
    let score = 0;
    let maxScore = 100;

    // Basic data (40 points)
    if (comprehensiveGPXData.statistics.totalTrackpoints > 0) score += 20;
    if (comprehensiveGPXData.statistics.totalDistance > 0) score += 20;

    // Elevation data (25 points)
    if (comprehensiveGPXData.statistics.totalElevationGain > 0) score += 25;

    // Time data (25 points)
    if (comprehensiveGPXData.statistics.movingTime > 0) score += 25;

    // Metadata (10 points)
    if (comprehensiveGPXData.metadata.name) score += 5;
    if (comprehensiveGPXData.metadata.creator) score += 5;

    return (score / maxScore * 100).toFixed(1);
}

// Basic endurance level determination without barbarian logic
function determineBasicEnduranceLevel(distanceKm) {
    if (distanceKm > 20) return "Endurance Athlete";
    if (distanceKm > 10) return "Advanced Runner";
    if (distanceKm > 5) return "Intermediate Fitness";
    if (distanceKm > 2) return "Beginner Level";
    return "Starter";
}

// Generate human-readable summary optimized for LLM understanding
function generateLLMSummary(combinedGPXData, advancedStats1, advancedStats2, comprehensiveGPXData1, comprehensiveGPXData2, barbarianResults) {
    const totalDistance = (combinedGPXData.distance / 1000).toFixed(1);
    const totalElevation = combinedGPXData.elevationGain.toFixed(0);
    const avgSpeed = ((advancedStats1.avgSpeedKmh + advancedStats2.avgSpeedKmh) / 2).toFixed(1);
    const totalTime = (combinedGPXData.movingTime / 60).toFixed(0);

    let summary = `Analysed dual training session: `;
    summary += `${totalDistance}km total distance, ${totalElevation}m elevation gain, `;
    summary += `${avgSpeed}km/h average speed, ${totalTime} minutes duration. `;

    // Track details
    const track1Distance = (comprehensiveGPXData1.statistics.totalDistance / 1000).toFixed(1);
    const track2Distance = (comprehensiveGPXData2.statistics.totalDistance / 1000).toFixed(1);
    const track1Elevation = comprehensiveGPXData1.statistics.totalElevationGain.toFixed(0);
    const track2Elevation = comprehensiveGPXData2.statistics.totalElevationGain.toFixed(0);

    summary += `Track 1: ${track1Distance}km, ${track1Elevation}m elevation. `;
    summary += `Track 2: ${track2Distance}km, ${track2Elevation}m elevation. `;


    summary += `Basic fitness level: ${determineBasicEnduranceLevel(totalDistance)}.`;

    return summary;
}

// Create minimal data structure for LLM chat context
export function createLLMChatContext(llmTrainingData) {
    return {
        user_training_summary: llmTrainingData.summary_for_llm,
        key_metrics: {
            total_distance_km: llmTrainingData.combined_analysis.totals.distance_km,
            total_elevation_m: llmTrainingData.combined_analysis.totals.elevation_gain_m,
            avg_speed_kmh: llmTrainingData.combined_analysis.averages.speed_kmh,
            duration_minutes: llmTrainingData.combined_analysis.totals.moving_time_minutes,
            tracks_analyzed: 2
        },
        training_level: llmTrainingData.training_analysis?.endurance_level || "Unknown",
        session_id: llmTrainingData.session.id
    };
}
