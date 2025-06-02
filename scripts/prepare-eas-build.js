#!/usr/bin/env node

// Explicitly ignore command line arguments to avoid issues with --platform
if (process.argv.length > 2) {
  const extraArgs = process.argv.slice(2);
  console.log(`${colors.yellow}Note: Ignoring extra command line arguments: ${extraArgs.join(' ')}${colors.reset}`);
}

/**
 * prepare-eas-build.js
 * 
 * This script ensures all required dependencies are installed before an EAS build
 * It runs as part of the prebuildCommand in eas.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}Preparing EAS build environment...${colors.reset}`);

// Ensure the scripts directory exists
const scriptsDir = path.join(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Check for required asset files
const requiredAssets = [
  { path: 'assets/logo_main.png', dest: 'assets/icon.png' },
  { path: 'assets/splash1.png', dest: 'assets/splash.png' },
  { path: 'assets/favicon.png', dest: 'assets/favicon.png' }
];

console.log(`${colors.yellow}Checking required asset files...${colors.reset}`);
requiredAssets.forEach(asset => {
  const srcPath = path.join(process.cwd(), asset.path);
  const destPath = path.join(process.cwd(), asset.dest);
  
  if (fs.existsSync(srcPath)) {
    console.log(`${colors.green}✓ ${asset.path} exists${colors.reset}`);
    // Copy the file to the destination if they're different
    if (asset.path !== asset.dest) {
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`${colors.green}✓ Copied ${asset.path} to ${asset.dest}${colors.reset}`);
      } catch (error) {
        console.error(`${colors.red}Failed to copy ${asset.path} to ${asset.dest}: ${error.message}${colors.reset}`);
      }
    }
  } else {
    console.error(`${colors.red}✗ ${asset.path} is missing!${colors.reset}`);
    // Try to find an alternative image
    const assetsDir = path.join(process.cwd(), 'assets');
    const images = fs.readdirSync(assetsDir).filter(file => 
      file.endsWith('.png') || file.endsWith('.jpg')
    );
    
    if (images.length > 0) {
      const altImage = path.join(assetsDir, images[0]);
      fs.copyFileSync(altImage, destPath);
      console.log(`${colors.yellow}Used ${images[0]} as fallback for ${asset.dest}${colors.reset}`);
    }
  }
});

// Create or update the android/local.properties file if needed
const androidDir = path.join(process.cwd(), 'android');
if (fs.existsSync(androidDir)) {
  const localPropertiesPath = path.join(androidDir, 'local.properties');
  console.log(`${colors.yellow}Creating/updating android/local.properties file...${colors.reset}`);
  const ndkPath = process.env.ANDROID_NDK_HOME || '/home/expo/ndk/25.1.8937393';
  const content = `ndk.dir=${ndkPath.replace(/\\/g, '\\\\')}\n`;
  
  try {
    fs.writeFileSync(localPropertiesPath, content);
    console.log(`${colors.green}Successfully created local.properties file${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Failed to create local.properties file: ${error.message}${colors.reset}`);
  }
  
  // Ensure gradle wrapper exists
  const gradleWrapperDir = path.join(androidDir, 'gradle', 'wrapper');
  if (!fs.existsSync(gradleWrapperDir)) {
    fs.mkdirSync(gradleWrapperDir, { recursive: true });
    
    // Create gradle-wrapper.properties
    const gradleWrapperPath = path.join(gradleWrapperDir, 'gradle-wrapper.properties');
    const wrapperContent = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.3-all.zip
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`;
    
    fs.writeFileSync(gradleWrapperPath, wrapperContent);
    console.log(`${colors.green}Created gradle wrapper properties file${colors.reset}`);
  }
}

// Optimize image assets
console.log(`${colors.yellow}Optimizing image assets...${colors.reset}`);
try {
  execSync('npx expo optimize --yes', { stdio: 'inherit' });
  console.log(`${colors.green}Image assets optimized successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to optimize assets: ${error.message}${colors.reset}`);
}

console.log(`${colors.green}EAS build environment prepared successfully!${colors.reset}`); 