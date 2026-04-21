# Start Marketing Planning Generator - Backend and Frontend

Write-Host "Starting Marketing Planning Generator..." -ForegroundColor Cyan
$backendPort = if ($env:PORT) { $env:PORT } else { "8000" }

# Install Python dependencies if needed
Write-Host "Checking Python dependencies..." -ForegroundColor Yellow
cd "d:\6th sem ki padhai\agentic AI\marketing planning generator"
pip install -q -r requirements.txt

# Start Python backend in background
Write-Host "Starting backend server on http://localhost:$backendPort..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\6th sem ki padhai\agentic AI\marketing planning generator'; python server.py"
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend dev server on http://localhost:5173..." -ForegroundColor Green
cd "d:\6th sem ki padhai\agentic AI\marketing planning generator\marketing-muse-main\marketing-muse-main"
npm run dev

Write-Host "Both servers are running!" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:$backendPort" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
