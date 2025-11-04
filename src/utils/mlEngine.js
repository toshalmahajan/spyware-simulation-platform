// Machine Learning Engine for Advanced Threat Detection
class MLEngine {
  constructor() {
    this.models = new Map();
    this.thresholds = {
      anomaly: 0.85,
      threat: 0.75,
      suspicious: 0.60
    };
    this.trainingData = [];
    this.isInitialized = false;
    this.threatHistory = [];
  }

  // Initialize ML models
  async initialize() {
    try {
      // Simulate model loading - in production, this would load TensorFlow models
      console.log('🔄 Initializing ML Threat Detection Engine...');
      
      // Initialize behavior patterns
      this.initializeBehaviorPatterns();
      this.initializeThreatPatterns();
      
      this.isInitialized = true;
      console.log('✅ ML Engine initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ ML Engine initialization failed:', error);
      return false;
    }
  }

  initializeBehaviorPatterns() {
    // Normal behavior patterns (simplified)
    this.normalPatterns = {
      login: {
        frequency: 'low',
        timePattern: 'business_hours',
        locationConsistency: 'high'
      },
      simulation: {
        duration: 'medium',
        complexity: 'varied',
        targetCount: 'reasonable'
      },
      agent: {
        heartbeat: 'regular',
        resourceUsage: 'stable',
        location: 'consistent'
      }
    };
  }

  initializeThreatPatterns() {
    // Known threat patterns (simplified)
    this.threatPatterns = {
      bruteForce: {
        loginAttempts: 10,
        timeWindow: 300, // 5 minutes
        successRate: 0.1
      },
      dataExfiltration: {
        dataVolume: 100, // MB
        timeWindow: 3600, // 1 hour
        destination: 'external'
      },
      privilegeEscalation: {
        permissionChanges: 5,
        timeWindow: 86400, // 24 hours
        pattern: 'rapid'
      },
      agentCompromise: {
        heartbeatMissed: 3,
        resourceSpike: 2.5, // 2.5x normal
        locationChange: 'frequent'
      }
    };
  }

  // Analyze activity for anomalies
  analyzeActivity(activity) {
    if (!this.isInitialized) {
      return { risk: 'unknown', confidence: 0, reason: 'ML engine not initialized' };
    }

    const features = this.extractFeatures(activity);
    const riskScore = this.calculateRiskScore(features, activity);
    const threatLevel = this.classifyThreat(riskScore, features);

    // Store for training
    this.trainingData.push({
      timestamp: new Date().toISOString(),
      features,
      riskScore,
      threatLevel,
      activity
    });

    // Keep only last 10,000 records
    if (this.trainingData.length > 10000) {
      this.trainingData = this.trainingData.slice(-10000);
    }

    // Store high-risk threats
    if (threatLevel.level !== 'low') {
      this.threatHistory.push({
        ...threatLevel,
        activity,
        features
      });
      
      // Keep only last 1000 threats
      if (this.threatHistory.length > 1000) {
        this.threatHistory = this.threatHistory.slice(-1000);
      }
    }

    return threatLevel;
  }

  extractFeatures(activity) {
    const features = {
      // Temporal features
      hourOfDay: new Date(activity.timestamp).getHours(),
      dayOfWeek: new Date(activity.timestamp).getDay(),
      isWeekend: [0, 6].includes(new Date(activity.timestamp).getDay()),
      
      // Behavioral features
      frequency: this.calculateFrequency(activity),
      repetition: this.calculateRepetition(activity),
      deviation: this.calculateDeviation(activity),
      
      // Resource features
      resourceIntensity: activity.resourceUsage || 0,
      dataVolume: activity.dataSize || 0,
      complexity: activity.complexity || 1
    };

    return features;
  }

  calculateFrequency(activity) {
    // Calculate how frequently this activity occurs
    const recentActivities = this.trainingData.filter(
      item => item.activity.type === activity.type && 
      Date.now() - new Date(item.timestamp).getTime() < 24 * 60 * 60 * 1000
    );
    
    return recentActivities.length / 24; // Activities per hour
  }

  calculateRepetition(activity) {
    // Calculate repetition patterns
    const similarActivities = this.trainingData.filter(
      item => this.isSimilarActivity(item.activity, activity)
    );
    
    return similarActivities.length;
  }

  calculateDeviation(activity) {
    // Calculate deviation from normal patterns
    let deviation = 0;
    
    if (this.normalPatterns[activity.type]) {
      const pattern = this.normalPatterns[activity.type];
      Object.keys(pattern).forEach(key => {
        if (activity[key] && pattern[key] !== activity[key]) {
          deviation += 1;
        }
      });
    }
    
    return deviation;
  }

  isSimilarActivity(activity1, activity2) {
    // Simple similarity check
    const keys = Object.keys(activity1);
    let matches = 0;
    
    keys.forEach(key => {
      if (activity1[key] === activity2[key]) {
        matches++;
      }
    });
    
    return matches / keys.length > 0.7;
  }

  calculateRiskScore(features, activity) {
    let score = 0;
    
    // Time-based risk
    if (features.hourOfDay < 6 || features.hourOfDay > 22) {
      score += 0.2; // Off-hours activity
    }
    
    if (features.isWeekend) {
      score += 0.1; // Weekend activity
    }
    
    // Frequency-based risk
    if (features.frequency > 10) {
      score += 0.3; // High frequency
    } else if (features.frequency > 5) {
      score += 0.15; // Medium frequency
    }
    
    // Repetition-based risk
    if (features.repetition > 50) {
      score += 0.2; // High repetition
    }
    
    // Deviation-based risk
    score += features.deviation * 0.1;
    
    // Resource-based risk
    if (features.resourceIntensity > 80) {
      score += 0.2; // High resource usage
    }
    
    if (features.dataVolume > 500) {
      score += 0.3; // Large data volume
    }
    
    // Activity-specific risks
    switch (activity.type) {
      case 'login':
        if (activity.failedAttempts > 5) score += 0.4;
        break;
      case 'data_export':
        if (activity.destination === 'external') score += 0.3;
        break;
      case 'privilege_change':
        score += 0.2;
        break;
    }
    
    return Math.min(score, 1.0);
  }

  classifyThreat(riskScore, features) {
    let level, confidence, reasons = [];
    
    if (riskScore >= this.thresholds.anomaly) {
      level = 'critical';
      confidence = riskScore;
      reasons.push('High anomaly detection score');
    } else if (riskScore >= this.thresholds.threat) {
      level = 'high';
      confidence = riskScore;
      reasons.push('Elevated threat indicators');
    } else if (riskScore >= this.thresholds.suspicious) {
      level = 'medium';
      confidence = riskScore;
      reasons.push('Suspicious activity patterns');
    } else {
      level = 'low';
      confidence = 1 - riskScore;
      reasons.push('Normal behavior patterns');
    }
    
    // Add specific reasons based on features
    if (features.frequency > 10) reasons.push('Unusual frequency');
    if (features.deviation > 3) reasons.push('Behavioral deviation');
    if (features.resourceIntensity > 80) reasons.push('High resource usage');
    
    return {
      level,
      confidence: Math.round(confidence * 100) / 100,
      riskScore: Math.round(riskScore * 100) / 100,
      reasons,
      timestamp: new Date().toISOString()
    };
  }

  // Train model with new data (simplified)
  async trainModel(newData) {
    console.log('🧠 Training ML model with new data...');
    
    // Simulate training process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update thresholds based on new data
    const avgRisk = newData.reduce((sum, item) => sum + item.riskScore, 0) / newData.length;
    this.thresholds.suspicious = Math.max(0.5, avgRisk - 0.1);
    this.thresholds.threat = Math.max(0.6, avgRisk);
    this.thresholds.anomaly = Math.max(0.7, avgRisk + 0.1);
    
    console.log('✅ Model training completed. Updated thresholds:', this.thresholds);
  }

  // Generate threat intelligence report
  generateThreatReport(timeframe = '7d') {
    const now = new Date();
    let startTime;
    
    switch (timeframe) {
      case '24h':
        startTime = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    const timeframeData = this.threatHistory.filter(
      item => new Date(item.timestamp) >= startTime
    );

    const threatLevels = {
      critical: timeframeData.filter(item => item.level === 'critical'),
      high: timeframeData.filter(item => item.level === 'high'),
      medium: timeframeData.filter(item => item.level === 'medium'),
      low: timeframeData.filter(item => item.level === 'low')
    };

    const activityTypes = {};
    timeframeData.forEach(item => {
      const type = item.activity.type || 'unknown';
      activityTypes[type] = (activityTypes[type] || 0) + 1;
    });

    const peakHours = {};
    timeframeData.forEach(item => {
      const hour = new Date(item.timestamp).getHours();
      peakHours[hour] = (peakHours[hour] || 0) + 1;
    });

    return {
      timeframe,
      totalThreats: timeframeData.length,
      threatDistribution: threatLevels,
      activityBreakdown: activityTypes,
      peakHours,
      averageConfidence: timeframeData.reduce((sum, item) => sum + item.confidence, 0) / timeframeData.length || 0,
      recommendations: this.generateRecommendations(threatLevels),
      topThreats: timeframeData
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10)
    };
  }

  generateRecommendations(threatLevels) {
    const recommendations = [];
    
    if (threatLevels.critical.length > 0) {
      recommendations.push({
        priority: 'critical',
        action: 'Immediate investigation required',
        description: `${threatLevels.critical.length} critical threats detected that require immediate attention`
      });
    }
    
    if (threatLevels.high.length > 5) {
      recommendations.push({
        priority: 'high',
        action: 'Review security policies',
        description: 'Multiple high-level threats suggest policy gaps'
      });
    }
    
    if (threatLevels.medium.length > 20) {
      recommendations.push({
        priority: 'medium',
        action: 'Enhance monitoring',
        description: 'Consider increasing monitoring frequency for suspicious activities'
      });
    }

    // Add ML-specific recommendations
    if (this.trainingData.length < 1000) {
      recommendations.push({
        priority: 'low',
        action: 'Collect more training data',
        description: 'ML model accuracy will improve with more historical data'
      });
    }

    return recommendations;
  }

  // Get real-time threat alerts
  getThreatAlerts(limit = 10) {
    return this.threatHistory
      .filter(threat => threat.level === 'critical' || threat.level === 'high')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // Get system health metrics
  getSystemHealth() {
    const recentThreats = this.threatHistory.filter(
      item => Date.now() - new Date(item.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    const criticalCount = recentThreats.filter(item => item.level === 'critical').length;
    const highCount = recentThreats.filter(item => item.level === 'high').length;

    let healthStatus = 'healthy';
    if (criticalCount > 0) healthStatus = 'critical';
    else if (highCount > 5) healthStatus = 'degraded';
    else if (highCount > 0) healthStatus = 'warning';

    return {
      status: healthStatus,
      threatsLast24h: recentThreats.length,
      criticalThreats: criticalCount,
      highThreats: highCount,
      modelAccuracy: Math.random() * 0.3 + 0.7, // Simulated accuracy
      dataPoints: this.trainingData.length
    };
  }
}

// Create singleton instance
export const mlEngine = new MLEngine();

// Initialize the engine when module loads
mlEngine.initialize().then(success => {
  if (success) {
    console.log('🚀 ML Threat Detection Engine ready');
  }
});

export default mlEngine;
