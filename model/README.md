# 🏃‍♂️ Barbarian Trainer - Custom AI Model

This directory contains the custom AI model configuration for the **Barbarian Trainer** project - a specialized running coach AI that provides personalized training plans and advice.

https://ollama.com/thewhitewizard/teddy

## 📁 Directory Structure

```
model/
├── Modelfile          # Custom Ollama model configuration
├── Dockerfile         # Base image with Node.js, Ollama, and custom model
└── README.md          # This file
```

## 🤖 Custom AI Model: `thewhitewizard/teddy:3b`

### Overview
The Barbarian Trainer uses a custom fine-tuned version of the **Qwen2.5:3B** model, specifically optimized for running coaching and training plan generation.

### Key Features
- **Specialized Running Coach**: Expert in creating personalized training programs
- **French Language**: Optimized for French-speaking users
- **Structured Output**: Provides organized training plans with clear phases

### Model Capabilities

#### 🎯 Training Plan Generation
- **Distance-based plans**: 5K, 10K, half-marathon, marathon, ultra
- **Periodization**: General preparation, specific training, tapering phases
- **Pace calculations**: Based on VMA (Maximal Aerobic Speed) estimates
- **Injury prevention**: Progressive volume management

## 🛠️ Development

### Customizing the Model
To modify the model behavior:

1. **Edit the Modelfile**:
   ```bash
   # Modify system prompt or parameters
   nano Modelfile
   ```

2. **Rebuild the model**:
   ```bash
   # Create new model version
   ollama create custom-teddy -f Modelfile
   ```

3. **Update Dockerfile**:
   ```dockerfile
   # Change model name in Dockerfile
   ollama pull custom-teddy:latest
   ```

## 🐳 Docker Setup

### Base Image Components
The Dockerfile creates a comprehensive environment with:

- **Node.js 24.3.0**: Runtime for the Barbarian Trainer application
- **Ollama**: Local AI model server
- **Custom Model**: Pre-loaded `thewhitewizard/teddy:3b` model
- **Utilities**: `jq`, `curl` for system operations

This docker image is used as the base image in the iApp.

## 📄 License

This project is licensed under the same terms as the main Barbarian Trainer project.

---

**🏃‍♂️ Ready to train like a Barbarian?** Your AI coach is waiting! 🚀
