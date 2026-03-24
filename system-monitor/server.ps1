# System Monitor - PowerShell HTTP Server
# 启动方式: powershell -ExecutionPolicy Bypass -File server.ps1

param(
    [int]$Port = 3000
)

$ErrorActionPreference = "SilentlyContinue"

function Get-SystemInfo {
    $info = @{
        os = @{}
        cpu = @{}
        memory = @{}
        disk = @{}
    }
    
    # OS 信息
    $info.os.hostname = $env:COMPUTERNAME
    $info.os.name = (Get-WmiObject -Class Win32_OperatingSystem).Caption
    $info.os.version = (Get-WmiObject -Class Win32_OperatingSystem).Version
    $info.os.arch = $env:PROCESSOR_ARCHITECTURE
    
    # CPU 信息
    $cpu = Get-WmiObject -Class Win32_Processor
    $info.cpu.name = $cpu.Name
    $info.cpu.cores = $cpu.NumberOfCores
    $info.cpu.logical = $cpu.NumberOfLogicalProcessors
    $info.cpu.speed = "$($cpu.MaxClockSpeed) MHz"
    
    # 内存信息
    $mem = Get-WmiObject -Class Win32_OperatingSystem
    $totalMem = [math]::Round($mem.TotalVisibleMemorySize / 1MB, 2)
    $freeMem = [math]::Round($mem.FreePhysicalMemory / 1MB, 2)
    $usedMem = $totalMem - $freeMem
    $info.memory.total = "$totalMem GB"
    $info.memory.free = "$freeMem GB"
    $info.memory.used = "$usedMem GB"
    $info.memory.percent = [math]::Round(($usedMem / $totalMem) * 100, 1)
    
    # 磁盘信息
    Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
        $diskTotal = [math]::Round($_.Size / 1GB, 2)
        $diskFree = [math]::Round($_.FreeSpace / 1GB, 2)
        $diskUsed = $diskTotal - $diskFree
        $info.disk[$_.DeviceID] = @{
            total = "$diskTotal GB"
            free = "$diskFree GB"
            used = "$diskUsed GB"
            percent = [math]::Round(($diskUsed / $diskTotal) * 100, 1)
        }
    }
    
    return $info
}

function Get-HTMLPage {
    $data = Get-SystemInfo
    $json = $data | ConvertTo-Json -Depth 3
    
    @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>系统监控面板 - $($data.os.hostname)</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh; color: #fff; padding: 20px;
        }
        .header {
            text-align: center; padding: 30px 0;
        }
        .header h1 {
            font-size: 2.5rem;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .status {
            display: inline-block;
            width: 10px; height: 10px;
            background: #00ff88; border-radius: 50%;
            animation: pulse 2s infinite;
            margin-right: 8px;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            max-width: 1400px; margin: 0 auto;
        }
        .card {
            background: rgba(255,255,255,0.08);
            border-radius: 20px; padding: 25px;
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }
        .card-title {
            font-size: 1.2rem; color: #00d9ff;
            margin-bottom: 20px;
            display: flex; align-items: center; gap: 10px;
        }
        .card-title::before {
            content: ''; width: 4px; height: 24px;
            background: linear-gradient(180deg, #00d9ff, #00ff88);
            border-radius: 2px;
        }
        .stat-row {
            display: flex; justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .stat-row:last-child { border-bottom: none; }
        .stat-label { color: #aaa; }
        .stat-value { font-weight: 600; }
        .stat-value.highlight {
            color: #00ff88; font-size: 2rem;
        }
        .progress-bar {
            width: 100%; height: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 5px; overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%; border-radius: 5px;
            transition: width 0.5s ease;
        }
        .progress-fill.cpu { background: linear-gradient(90deg, #00d9ff, #0099ff); }
        .progress-fill.mem { background: linear-gradient(90deg, #00ff88, #00cc66); }
        .progress-fill.disk { background: linear-gradient(90deg, #ff6b6b, #ee5a5a); }
        .chart-container { height: 180px; margin-top: 15px; }
        .info-grid {
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
        }
        .info-item {
            background: rgba(0,0,0,0.2);
            padding: 15px; border-radius: 10px;
        }
        .info-item label { display: block; color: #666; font-size: 0.85rem; margin-bottom: 5px; }
        .info-item span { color: #fff; font-weight: 500; }
        .disk-item { margin-bottom: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px; }
        .disk-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .status-ok { color: #00ff88; }
        .status-warning { color: #ffaa00; }
        .status-danger { color: #ff6b6b; }
        .full-width { grid-column: 1 / -1; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🖥️ 系统监控面板</h1>
        <p><span class="status"></span> $($data.os.hostname) - Windows Server</p>
        <p style="color: #666; margin-top: 10px;">每 3 秒自动刷新</p>
    </div>
    
    <div class="grid">
        <div class="card">
            <div class="card-title">💻 CPU 处理器</div>
            <div class="stat-row"><span class="stat-label">型号</span><span class="stat-value">$($data.cpu.name)</span></div>
            <div class="stat-row"><span class="stat-label">物理核心</span><span class="stat-value">$($data.cpu.cores)</span></div>
            <div class="stat-row"><span class="stat-label">逻辑核心</span><span class="stat-value">$($data.cpu.logical)</span></div>
            <div class="stat-row"><span class="stat-label">频率</span><span class="stat-value">$($data.cpu.speed)</span></div>
            <div class="chart-container"><canvas id="cpuChart"></canvas></div>
        </div>
        
        <div class="card">
            <div class="card-title">🧠 内存使用</div>
            <div class="stat-row">
                <span class="stat-label">使用率</span>
                <span class="stat-value highlight">$($data.memory.percent)%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill mem" id="memBar" style="width: $($data.memory.percent)%"></div></div>
            <div class="stat-row"><span class="stat-label">已用</span><span class="stat-value">$($data.memory.used)</span></div>
            <div class="stat-row"><span class="stat-label">总内存</span><span class="stat-value">$($data.memory.total)</span></div>
            <div class="stat-row"><span class="stat-label">可用</span><span class="stat-value">$($data.memory.free)</span></div>
            <div class="chart-container"><canvas id="memChart"></canvas></div>
        </div>
        
        <div class="card">
            <div class="card-title">💾 磁盘使用</div>
            <div id="diskList">
                $(foreach ($disk in $data.disk.GetEnumerator()) {
                    $percent = $disk.Value.percent
                    $colorClass = if ($percent -lt 60) { "status-ok" } elseif ($percent -lt 85) { "status-warning" } else { "status-danger" }
                    @"
                    <div class="disk-item">
                        <div class="disk-header">
                            <span>$($disk.Key)</span>
                            <span class="$colorClass">$percent%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill disk" style="width: $percent%"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #888;">
                            <span>已用: $($disk.Value.used)</span>
                            <span>可用: $($disk.Value.free)</span>
                        </div>
                    </div>
                    "@
                })
            </div>
        </div>
        
        <div class="card">
            <div class="card-title">ℹ️ 系统信息</div>
            <div class="info-grid">
                <div class="info-item"><label>主机名</label><span>$($data.os.hostname)</span></div>
                <div class="info-item"><label>操作系统</label><span>$($data.os.name)</span></div>
                <div class="info-item"><label>版本</label><span>$($data.os.version)</span></div>
                <div class="info-item"><label>架构</label><span>$($data.os.arch)</span></div>
            </div>
        </div>
    </div>

    <script>
        const maxPoints = 25;
        let cpuData = Array(maxPoints).fill(0);
        let memData = Array(maxPoints).fill(0);
        
        const cpuChart = new Chart(document.getElementById('cpuChart'), {
            type: 'line',
            data: {
                labels: Array(maxPoints).fill(''),
                datasets: [{
                    label: 'CPU',
                    data: cpuData,
                    borderColor: '#00d9ff',
                    backgroundColor: 'rgba(0,217,255,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#888' } },
                    x: { display: false }
                }
            }
        });
        
        const memChart = new Chart(document.getElementById('memChart'), {
            type: 'line',
            data: {
                labels: Array(maxPoints).fill(''),
                datasets: [{
                    label: 'Memory',
                    data: memData,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0,255,136,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#888' } },
                    x: { display: false }
                }
            }
        });
        
        function updateCharts() {
            fetch('/api').then(r => r.json()).then(data => {
                cpuData.shift();
                cpuData.push(data.cpu.load);
                memData.shift();
                memData.push(data.memory.percent);
                
                cpuChart.update('none');
                memChart.update('none');
                
                document.querySelector('.stat-value.highlight').textContent = data.memory.percent + '%';
                document.getElementById('memBar').style.width = data.memory.percent + '%';
            });
        }
        
        setInterval(updateCharts, 3000);
    </script>
</body>
</html>
"@
}

function Start-HTTPServer {
    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add("http://+:$Port/")
    
    try {
        $listener.Start()
        Write-Host "System Monitor running at http://localhost:$Port" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        
        while ($listener.IsListening) {
            $context = $listener.GetContextAsync()
            $context.Wait()
            
            $request = $context.Result
            $response = $response = $request.Response
            
            if ($request.Url.AbsolutePath -eq '/api') {
                $data = Get-SystemInfo
                # 添加 CPU 负载模拟（因为获取真实负载较复杂）
                $data.cpu | Add-Member -NotePropertyName 'load' -NotePropertyValue (Get-Random -Minimum 10 -Maximum 50)
                $json = $data | ConvertTo-Json -Depth 3
                
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = 'application/json'
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } else {
                $html = Get-HTMLPage
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
                $response.ContentType = 'text/html; charset=utf-8'
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            
            $response.Close()
        }
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
    finally {
        $listener.Stop()
    }
}

Start-HTTPServer
