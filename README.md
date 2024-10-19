# graininsight
Basmati Rice Grain Analyzer

# Build & Run
docker build --platform linux/amd64 -t isanyam/grain-analysis-app:latest .
docker run --platform linux/amd64 -p 15000:5000 isanyam/grain-analysis-app:latest