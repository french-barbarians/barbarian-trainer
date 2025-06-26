import { IExecDataProtectorDeserializer } from "@iexec/dataprotector-deserializer";
import fs from "node:fs/promises";
import { createTunnel } from "./https-tunnel/createTunnel.js";
import { gossipUrl } from "./https-tunnel/gossipUrl.js";
import { sleep } from "./utils/sleep.js";
import { 
  parseGPXData, 
  generateFallbackTrainingData,
  calculateAdvancedStats,
  extractGPXMetadata,
  extractComprehensiveGPXData
} from "./utils/gpxParser.js";
import {
  prepareLLMTrainingData,
  createLLMChatContext
} from "./utils/llmDataPreparer.js";

const AGENT_PORT = 11434;

const main = async () => {
  const { IEXEC_OUT = "/iexec_out" } = process.env;

  let computedJsonObj = {};

  try {
    let NGROK_TOKEN;
    let GOSSIP_PRIVATE_KEY;
    try {
      console.log("Loading app secrets...");
      const { IEXEC_APP_DEVELOPER_SECRET } = process.env;
      ({ NGROK_TOKEN, GOSSIP_PRIVATE_KEY } = JSON.parse(
        Buffer.from(IEXEC_APP_DEVELOPER_SECRET, "base64").toString("utf8")
      ));

      console.log("App secrets loaded");
    } catch {
      throw Error("Failed to lod app secrets");
    }

    // Load Dual GPX protected data
    let gpxData1 = null, gpxData2 = null;
    let advancedStats1 = null, advancedStats2 = null;
    let gpxMetadata1 = null, gpxMetadata2 = null;
    let comprehensiveGPXData1 = null, comprehensiveGPXData2 = null;
    let combinedGPXData = null;
    
    try {
      console.log("Loading protected dual GPX data...");
      const deserializer = new IExecDataProtectorDeserializer();
      
      // Load both GPX files from protected storage
      const gpx1Buffer = await deserializer.getValue("gpx1", "binary");
      const gpx2Buffer = await deserializer.getValue("gpx2", "binary");
      const gpx1String = new TextDecoder('utf-8').decode(gpx1Buffer);
      const gpx2String = new TextDecoder('utf-8').decode(gpx2Buffer);
      
      console.log("📁 Processing GPX File 1...");
      // Extract comprehensive GPX data structure for AI training - File 1
      comprehensiveGPXData1 = extractComprehensiveGPXData(gpx1String);
      // Parse GPX data for basic compatibility (legacy support) - File 1
      gpxData1 = parseGPXData(gpx1String);
      gpxMetadata1 = extractGPXMetadata(gpx1String);
      // Calculate advanced statistics - File 1
      advancedStats1 = calculateAdvancedStats(gpxData1.trackPoints);
      
      console.log("📁 Processing GPX File 2...");
      // Extract comprehensive GPX data structure for AI training - File 2
      comprehensiveGPXData2 = extractComprehensiveGPXData(gpx2String);
      // Parse GPX data for basic compatibility (legacy support) - File 2
      gpxData2 = parseGPXData(gpx2String);
      gpxMetadata2 = extractGPXMetadata(gpx2String);
      // Calculate advanced statistics - File 2
      advancedStats2 = calculateAdvancedStats(gpxData2.trackPoints);
      
      // Combine both datasets for unified analysis
      combinedGPXData = {
        distance: gpxData1.distance + gpxData2.distance,
        elevationGain: gpxData1.elevationGain + gpxData2.elevationGain,
        elevationLoss: gpxData1.elevationLoss + gpxData2.elevationLoss,
        trackPoints: [...gpxData1.trackPoints, ...gpxData2.trackPoints],
        totalTime: Math.max(gpxData1.totalTime, gpxData2.totalTime),
        movingTime: gpxData1.movingTime + gpxData2.movingTime,
        bounds: {
          minLat: Math.min(gpxData1.bounds.minLat, gpxData2.bounds.minLat),
          maxLat: Math.max(gpxData1.bounds.maxLat, gpxData2.bounds.maxLat),
          minLon: Math.min(gpxData1.bounds.minLon, gpxData2.bounds.minLon),
          maxLon: Math.max(gpxData1.bounds.maxLon, gpxData2.bounds.maxLon)
        }
      };
      
      
      console.log("✅ Dual GPX Data Extraction Complete!");
      console.log(`📊 Comprehensive Dual Data Structure:`);
      console.log(`   � Processing 2 GPX files`);
      console.log(`   📍 GPX1: ${comprehensiveGPXData1.statistics.totalTrackpoints} trackpoints`);
      console.log(`   📍 GPX2: ${comprehensiveGPXData2.statistics.totalTrackpoints} trackpoints`);
      console.log(`   📍 Total: ${comprehensiveGPXData1.statistics.totalTrackpoints + comprehensiveGPXData2.statistics.totalTrackpoints} trackpoints`);
      console.log(`   🛤️  Combined tracks: ${comprehensiveGPXData1.tracks.length + comprehensiveGPXData2.tracks.length}`);
      console.log(`   📏 Total distance: ${((comprehensiveGPXData1.statistics.totalDistance + comprehensiveGPXData2.statistics.totalDistance) / 1000).toFixed(2)} km`);
      console.log(`   ⛰️  Total elevation gain: ${(comprehensiveGPXData1.statistics.totalElevationGain + comprehensiveGPXData2.statistics.totalElevationGain).toFixed(0)} m`);
      
      if (comprehensiveGPXData1.metadata.name) {
        console.log(`   📝 Track 1: "${comprehensiveGPXData1.metadata.name}"`);
      }
      if (comprehensiveGPXData2.metadata.name) {
        console.log(`   📝 Track 2: "${comprehensiveGPXData2.metadata.name}"`);
      }
      
    } catch (e) {
      console.log("❌ Failed to load protected dual GPX data:", e.message);
      console.log("Using fallback training data...");
      
      // Fallback to basic training data if GPX loading fails
      gpxData1 = generateFallbackTrainingData();
      gpxData2 = generateFallbackTrainingData();
      combinedGPXData = {
        distance: gpxData1.distance + gpxData2.distance,
        elevationGain: gpxData1.elevationGain + gpxData2.elevationGain,
        elevationLoss: gpxData1.elevationLoss + gpxData2.elevationLoss,
        trackPoints: [...gpxData1.trackPoints, ...gpxData2.trackPoints],
        totalTime: Math.max(gpxData1.totalTime, gpxData2.totalTime),
        movingTime: gpxData1.movingTime + gpxData2.movingTime,
        bounds: gpxData1.bounds
      };
      advancedStats1 = calculateAdvancedStats(gpxData1.trackPoints);
      advancedStats2 = calculateAdvancedStats(gpxData2.trackPoints);
      gpxMetadata1 = { trackName: "Fallback Training Route 1" };
      gpxMetadata2 = { trackName: "Fallback Training Route 2" };
      
    }

    const { IEXEC_REQUESTER_SECRET_1, IEXEC_REQUESTER_SECRET_42 } = process.env;
    if (IEXEC_REQUESTER_SECRET_1) {
      const redactedRequesterSecret = IEXEC_REQUESTER_SECRET_1.replace(
        /./g,
        "*"
      );
      console.log(`Got requester secret 1 (${redactedRequesterSecret})!`);
    } else {
      console.log(`Requester secret 1 is not set`);
    }
    if (IEXEC_REQUESTER_SECRET_42) {
      const redactedRequesterSecret = IEXEC_REQUESTER_SECRET_42.replace(
        /./g,
        "*"
      );
      console.log(`Got requester secret 42 (${redactedRequesterSecret})!`);
    } else {
      console.log(`Requester secret 42 is not set`);
    }

    // TODO: COMPREHENSIVE DATA PREPARATION FOR LATER USE
    // Prepare comprehensive LLM training data structure (commented for first step)
    /*
    const llmTrainingData = prepareLLMTrainingData(
      gpxData1, 
      gpxData2, 
      combinedGPXData, 
      advancedStats1, 
      advancedStats2, 
      comprehensiveGPXData1, 
      comprehensiveGPXData2, 
    );

    const llmChatContext = createLLMChatContext(llmTrainingData);
    console.log("📊 Dual Training session completed!");
    console.log(`   📁 Files processed: 2`);
    console.log(`   📏 Total Distance: ${(combinedGPXData.distance / 1000).toFixed(2)} km`);
    console.log(`   ⛰️  Total Elevation Gain: ${combinedGPXData.elevationGain.toFixed(0)} m`);
    
    console.log(`   📊 LLM Data Quality - Track 1: ${llmTrainingData.data_quality.track1_completeness}%`);
    console.log(`   📊 LLM Data Quality - Track 2: ${llmTrainingData.data_quality.track2_completeness}%`);
    
    if (advancedStats1.avgSpeedKmh > 0 || advancedStats2.avgSpeedKmh > 0) {
      const combinedAvgSpeed = (advancedStats1.avgSpeedKmh + advancedStats2.avgSpeedKmh) / 2;
      const combinedMaxSpeed = Math.max(advancedStats1.maxSpeedKmh, advancedStats2.maxSpeedKmh);
      const combinedMovingTime = advancedStats1.movingTime + advancedStats2.movingTime;
      
      console.log(`   ⚡ Combined Avg Speed: ${combinedAvgSpeed.toFixed(1)} km/h`);
      console.log(`   🏃 Max Speed: ${combinedMaxSpeed.toFixed(1)} km/h`);
      console.log(`   ⏱️  Total Training Duration: ${(combinedMovingTime / 60).toFixed(1)} minutes`);
    }

    // Prepare data for LLM request
    console.log("🤖 Preparing data for LLM...");
    console.log(`   📝 LLM Summary: ${llmTrainingData.summary_for_llm}`);
    
    // This is the data you can now use in your requestBody for the LLM
    const userTrainingContent = `Données d'entraînement analysées: ${llmTrainingData.summary_for_llm}
    Métriques clés:
    - Distance totale: ${llmChatContext.key_metrics.total_distance_km} km
    - Dénivelé: ${llmChatContext.key_metrics.total_elevation_m} m  
    - Vitesse moyenne: ${llmChatContext.key_metrics.avg_speed_kmh} km/h
    - Durée: ${llmChatContext.key_metrics.duration_minutes} minutes

    Analyse de 2 parcours distincts disponible pour conseils personnalisés.`;
    */

    // SIMPLIFIED VERSION FOR FIRST STEP: Only essential metrics
    console.log("📊 Training session completed!");
    console.log(`   📁 Files processed: 2`);
    console.log(`   📏 Total Distance: ${(combinedGPXData.distance / 1000).toFixed(2)} km`);
    console.log(`   ⛰️  Total Elevation Gain: ${combinedGPXData.elevationGain.toFixed(0)} m`);
    
    // Calculate simplified metrics for LLM
    let combinedAvgSpeed = 0;
    let combinedMovingTime = 0;
    
    if (advancedStats1 && advancedStats2 && (advancedStats1.avgSpeedKmh > 0 || advancedStats2.avgSpeedKmh > 0)) {
      combinedAvgSpeed = (advancedStats1.avgSpeedKmh + advancedStats2.avgSpeedKmh) / 2;
      combinedMovingTime = advancedStats1.movingTime + advancedStats2.movingTime;
      
      console.log(`   ⚡ Combined Avg Speed: ${combinedAvgSpeed.toFixed(1)} km/h`);
      console.log(`   ⏱️  Total Training Duration: ${(combinedMovingTime / 60).toFixed(1)} minutes`);
    }

    // Get current date for training context
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    // Simplified training content with only essential info
    const userTrainingContent = `Date: ${currentDate}
Distance: ${(combinedGPXData.distance / 1000).toFixed(1)} km
Vitesse moyenne: ${combinedAvgSpeed.toFixed(1)} km/h
Dénivelé: ${combinedGPXData.elevationGain.toFixed(0)} m`;

    // send user data to agent - SIMPLIFIED VERSION
    console.log("🤖 Sending simplified data to LLM...");
    console.log(`   📝 Training data: ${userTrainingContent}`);

    const requestBody = {
      model: "thewhitewizard/teddy:3b",
      messages: [
        {
          role: "system",
          content:
            "Tu vas recevoir les données d'entraînement de l'utilisateur. Analyse-les et garde-les en mémoire pour les prochaines questions.",
        },
        {
          role: "user",
          content: "trail 16km 300m D+ en 1h42",
        },
        {
          role: "assistant",
          content:
            "J'ai bien reçu et analysé tes données d'entraînement. Je les garde en mémoire pour personnaliser mes conseils. Tu peux maintenant me poser tes questions sur ton plan d'entraînement.",
        },
      ],
      stream: false,
      options: {
        temperature: 0.1, // Très factuelle pour le contexte
        num_predict: 50, // Réponse courte
      },
    };

    const response = await fetch(`http://localhost:${AGENT_PORT}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then((res) => res?.json());
    console.log(`Agent response: ${JSON.stringify(response, null, 2)}`);

    // Create https tunnel
    const tunnelUrl = await createTunnel({
      port: 11434,
      authtoken: NGROK_TOKEN,
    });
    // gossip tunnel URL
    await gossipUrl({ gossipPrivateKey: GOSSIP_PRIVATE_KEY, url: tunnelUrl });

    // Write result to IEXEC_OUT
    await fs.writeFile(
      `${IEXEC_OUT}/result.json`,
      JSON.stringify({
        ok: true,
      })
    );

    // Build the "computed.json" object
    computedJsonObj = {
      "deterministic-output-path": `${IEXEC_OUT}/result.json`,
    };
    await fs.writeFile(
      `${IEXEC_OUT}/computed.json`,
      JSON.stringify(computedJsonObj)
    );

    console.log("Tunnel open");
    await sleep(50 * 60000);
  } catch (e) {
    // Handle errors
    console.log(e);

    // Build the "computed.json" object with an error message
    computedJsonObj = {
      "deterministic-output-path": IEXEC_OUT,
      "error-message": "Oops something went wrong",
    };
  } finally {
    // Save the "computed.json" file
    await fs.writeFile(
      `${IEXEC_OUT}/computed.json`,
      JSON.stringify(computedJsonObj)
    );
  }
};

main();
