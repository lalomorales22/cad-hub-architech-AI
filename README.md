
# CAD Hub Architect AI

A powerful AI-driven CAD (Computer-Aided Design) platform that combines advanced 3D modeling capabilities with cutting-edge artificial intelligence services. Built with React, TypeScript, and Three.js, this application provides a comprehensive suite of tools for architectural design, 3D modeling, and AI-powered generation.

![CAD Hub Architect AI](https://github.com/lalomorales22/cad-hub-architech-AI)

## 🚀 Features

### Core CAD Functionality
- **3D Modeling**: Interactive 3D workspace with Three.js rendering
- **Parametric Design**: Create and modify parametric 3D models
- **Scene Management**: Advanced scene composition and object manipulation
- **Blueprint Generation**: Convert 3D models to technical blueprints
- **Model Import/Export**: Support for various CAD file formats
- **Structural Analysis**: Built-in structural integrity analysis tools

### AI-Powered Generation
- **Text-to-CAD**: Generate 3D models from natural language descriptions
- **Image-to-CAD**: Convert images into 3D CAD models
- **Advanced AI Studio**: Integration with multiple AI providers:
  - **Fal.AI**: Real-time 3D generation and image-to-3D conversion
  - **Stability AI**: Advanced image generation and enhancement
  - **Replicate**: ML model processing and 3D generation
  - **DeepMind**: Structural analysis and molecular modeling (simulated)

### Professional Tools
- **Cost Estimation**: Automated project cost calculation
- **Documentation Generator**: Create technical documentation from models
- **Template Library**: Pre-built architectural templates
- **Enhanced Tool Palette**: Comprehensive modeling tools
- **Project Timeline**: Track project progress and milestones

### User Experience
- **Dark/Light Theme**: Customizable interface themes
- **Project Management**: Organize and manage multiple projects
- **Real-time Collaboration**: Share and collaborate on designs
- **Interactive Chat**: AI assistant for design guidance
- **Settings & Profiles**: Customizable user preferences

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **3D Engine**: Three.js for 3D rendering and modeling
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite for fast development and building
- **State Management**: React Context + TanStack Query
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icon library

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- Modern web browser with WebGL support

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lalomorales22/cad-hub-architech-AI.git
cd cad-hub-architech-AI
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## 🔑 API Configuration

To use the AI-powered features, you'll need to configure API keys for the various AI services:

### Setting Up API Keys

1. **Open Settings**: Click on the settings icon in the top navigation
2. **Navigate to API Keys**: Go to the API Keys section
3. **Add Your Keys**: Enter your API keys for the services you want to use

### Supported AI Services

#### Fal.AI
- **Purpose**: 3D model generation, image-to-3D conversion
- **Get API Key**: Visit [fal.ai](https://fal.ai) and create an account
- **Usage**: Real-time 3D generation from text prompts and images

#### Stability AI
- **Purpose**: Image generation, texture creation, concept art
- **Get API Key**: Visit [stability.ai](https://stability.ai) and sign up for API access
- **Usage**: Generate high-quality images and textures for your designs

#### Replicate
- **Purpose**: ML model processing, 3D generation, image enhancement
- **Get API Key**: Visit [replicate.com](https://replicate.com) and create an account
- **Usage**: Access to various ML models for design enhancement

#### DeepMind (Simulated)
- **Purpose**: Structural analysis and stability assessment
- **Note**: Currently simulated - no actual API key required
- **Usage**: Analyze structural integrity of your designs

## 🎯 How to Use

### Basic Workflow

1. **Create a New Project**: Start from the dashboard or use a template
2. **Design Your Model**: Use the 3D workspace and tool palette
3. **Generate with AI**: Use text or image prompts to generate designs
4. **Enhance and Refine**: Apply AI enhancements and structural analysis
5. **Export and Share**: Generate blueprints and export your models

### Key Features Usage

#### Text-to-CAD Generation
1. Navigate to the Text-to-CAD section
2. Enter a detailed description of what you want to create
3. Select generation type (architecture, furniture, etc.)
4. Choose style and complexity level
5. Press Ctrl+Enter to generate

#### Image-to-CAD Conversion
1. Go to the Image-to-CAD section
2. Upload an image or provide an image URL
3. Configure conversion settings
4. Generate 3D model from the image

#### Advanced AI Studio
1. Click on the AI Studio widget
2. Select your preferred AI provider (Fal.AI, Stability AI, etc.)
3. Choose the appropriate model
4. Enter prompts or upload images
5. Configure provider-specific settings
6. Generate enhanced designs

#### Parametric Design
1. Open the Parametric Studio
2. Create or modify parametric models
3. Adjust parameters in real-time
4. See immediate updates in the 3D viewport

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AIAgent.tsx     # AI assistant
│   ├── ThreeJSCanvas.tsx # 3D rendering
│   └── ...
├── services/           # API services
│   ├── aiServices.ts   # Basic AI services
│   └── advancedAIServices.ts # Advanced AI integrations
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
└── styles/             # CSS and styling
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Troubleshooting

### Common Issues

**API Key Errors**: Make sure your API keys are correctly entered in the settings and that you have sufficient credits/quota.

**3D Rendering Issues**: Ensure your browser supports WebGL and hardware acceleration is enabled.

**Build Failures**: Clear node_modules and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS Errors**: Some AI services may require CORS configuration. Check the browser console for specific error messages.

### Getting Help

- Check the [Issues](https://github.com/lalomorales22/cad-hub-architech-AI/issues) page
- Join our community discussions
- Review the documentation for specific features

## 🌟 Acknowledgments

- Three.js community for excellent 3D rendering capabilities
- shadcn/ui for beautiful component library
- AI service providers (Fal.AI, Stability AI, Replicate) for powerful AI capabilities
- Open source community for various tools and libraries

## 📊 Project Status

This project is actively maintained and continuously updated with new features and improvements. Check the [releases](https://github.com/lalomorales22/cad-hub-architech-AI/releases) page for the latest updates.

---

**Built with ❤️ by the CAD Hub Architect AI team**
