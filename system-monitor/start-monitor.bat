@echo off
chcp 65001 >nul
title System Monitor
echo ======================================
echo   System Monitor - Windows Server
echo ======================================
echo.

echo Starting HTTP server on port 3000...
echo.

powershell.exe -ExecutionPolicy Bypass -Command "& {
$Port = 3000

function Get-SystemInfo {
    $info = @{
        os = @{}
        cpu = @{}
        memory = @{}
        disk = @{}
    }
    $info.os.hostname = $env:COMPUTERNAME
    $os = Get-WmiObject -Class Win32_OperatingSystem
    $info.os.name = $os.Caption
    $info.os.version = $os.Version
    $info.os.arch = $env:PROCESSOR_ARCHITECTURE
    
    $cpu = Get-WmiObject -Class Win32_Processor
    $info.cpu.name = $cpu.Name
    $info.cpu.cores = $cpu.NumberOfCores
    $info.cpu.logical = $cpu.NumberOfLogicalProcessors
    $info.cpu.speed = '$($cpu.MaxClockSpeed) MHz'
    
    $total = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
    $free = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
    $used = $total - $free
    $info.memory.total = '$total GB'
    $info.memory.free = '$free GB'
    $info.memory.used = '$used GB'
    $info.memory.percent = [math]::Round(($used / $total) * 100, 1)
    
    Get-WmiObject -Class Win32_LogicalDisk -Filter 'DriveType=3' | ForEach-Object {
        $dt = [math]::Round($_.Size / 1GB, 2)
        $df = [math]::Round($_.FreeSpace / 1GB, 2)
        $du = $dt - $df
        $info.disk[$_.DeviceID] = @{
            total = '$dt GB'
            free = '$df GB'
            used = '$du GB'
            percent = [math]::Round(($du / $dt) * 100, 1)
        }
    }
    return $info
}

function Get-HTML {
    $d = Get-SystemInfo
    @'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>System Monitor</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;color:#fff;padding:20px}
.header{text-align:center;padding:30px 0}
.header h1{font-size:2.5rem;background:linear-gradient(90deg,#00d9ff,#00ff88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.status{display:inline-block;width:10px;height:10px;background:#00ff88;border-radius:50%;animation:pulse 2s infinite;margin-right:8px}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;max-width:1400px;margin:0 auto}
.card{background:rgba(255,255,255,.08);border-radius:20px;padding:25px;border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(10px)}
.card-title{font-size:1.2rem;color:#00d9ff;margin-bottom:20px;display:flex;align-items:center;gap:10px}
.card-title::before{content:'';width:4px;height:24px;background:linear-gradient(180deg,#00d9ff,#00ff88);border-radius:2px}
.stat-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.stat-row:last-child{border-bottom:none}
.stat-label{color:#aaa}
.stat-value{font-weight:600}
.stat-value.highlight{color:#00ff88;font-size:2rem}
.progress-bar{width:100%;height:10px;background:rgba(255,255,255,.1);border-radius:5px;overflow:hidden;margin:10px 0}
.progress-fill{height:100%;border-radius:5px;transition:width .5s ease}
.progress-fill.cpu{background:linear-gradient(90deg,#00d9ff,#0099ff)}
.progress-fill.mem{background:linear-gradient(90deg,#00ff88,#00cc66)}
.progress-fill.disk{background:linear-gradient(90deg,#ff6b6b,#ee5a5a)}
.chart-container{height:180px;margin-top:15px}
.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.info-item{background:rgba(0,0,0,.2);padding:15px;border-radius:10px}
.info-item label{display:block;color:#666;font-size:.85rem;margin-bottom:5px}
.info-item span{color:#fff;font-weight:500}
.disk-item{margin-bottom:15px;padding:15px;background:rgba(0,0,0,.2);border-radius:10px}
.disk-header{display:flex;justify-content:space-between;margin-bottom:8px}
.status-ok{color:#00ff88}
.status-warning{color:#ffaa00}
.status-danger{color:#ff6b6b}
</style>
</head>
<body>
<div class="header">
<h1>System Monitor</h1>
<p><span class="status"></span> '@ + $d.os.hostname + '@ - Windows Server</p>
<p style="color:#666;margin-top:10px">Auto refresh every 3s</p>
</div>
<div class="grid">
<div class="card">
<div class="card-title">CPU</div>
<div class="stat-row"><span class="stat-label">Model</span><span class="stat-value">@'+ $d.cpu.name + '@</span></div>
<div class="stat-row"><span class="stat-label">Cores</span><span class="stat-value">@'+ $d.cpu.cores + '@</span></div>
<div class="stat-row"><span class="stat-label">Threads</span><span class="stat-value">@'+ $d.cpu.logical + '@</span></div>
<div class="chart-container"><canvas id="cpuChart"></canvas></div>
</div>
<div class="card">
<div class="card-title">Memory</div>
<div class="stat-row><span class="stat-label">Usage</span><span class="stat-value highlight">@'+ $d.memory.percent + '@%</span></div>
<div class="progress-bar"><div class="progress-fill mem" id="memBar" style="width:@'+ $d.memory.percent + '@%"></div></div>
<div class="stat-row"><span class="stat-label">Used</span><span class="stat-value">@'+ $d.memory.used + '@</span></div>
<div class="stat-row"><span class="stat-label">Total</span><span class="stat-value">@'+ $d.memory.total + '@</span></div>
<div class="chart-container"><canvas id="memChart"></canvas></div>
</div>
<div class="card">
<div class="card-title">Disk</div>
<div id="diskList"></div>
</div>
<div class="card">
<div class="card-title">System</div>
<div class="info-grid">
<div class="info-item"><label>Host</label><span>@'+ $d.os.hostname + '@</span></div>
<div class="info-item"><label>OS</label><span>@'+ $d.os.name + '@</span></div>
<div class="info-item"><label>Version</label><span>@'+ $d.os.version + '@</span></div>
<div class="info-item"><label>Arch</label><span>@'+ $d.os.arch + '@</span></div>
</div>
</div>
</div>
<script>
let cpuData=Array(25).fill(0),memData=Array(25).fill(0);
const cpuChart=new Chart(document.getElementById('cpuChart'),{type:'line',data:{labels:Array(25).fill(''),datasets:[{label:'CPU',data:cpuData,borderColor:'#00d9ff',backgroundColor:'rgba(0,217,255,0.1)',fill:true,tension:0.4,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,grid:{color:'rgba(255,255,255,0.1)'},ticks:{color:'#888'}},x:{display:false}}}});
const memChart=new Chart(document.getElementById('memChart'),{type:'line',data:{labels:Array(25).fill(''),datasets:[{label:'Mem',data:memData,borderColor:'#00ff88',backgroundColor:'rgba(0,255,136,0.1)',fill:true,tension:0.4,pointRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,grid:{color:'rgba(255,255,255,0.1)'},ticks:{color:'#888'}},x:{display:false}}}});
setInterval(()=>{fetch('/api').then(r=>r.json()).then(d=>{cpuData.shift();cpuData.push(d.cpu.load);memData.shift();memData.push(d.memory.percent);cpuChart.update('none');memChart.update('none');document.querySelector('.stat-value.highlight').textContent=d.memory.percent+'%';document.getElementById('memBar').style.width=d.memory.percent+'%'})},3000);
</script>
</body>
</html>
'@
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://+:$Port/")
$listener.Start()
Write-Host "Server running at http://localhost:$Port" -ForegroundColor Green

while($listener.IsListening){
    $ctx = $listener.GetContextAsync().Result
    $resp = $ctx.Response
    if($ctx.Request.Url.AbsolutePath -eq '/api'){
        $d = Get-SystemInfo
        $d.cpu | Add-Member -NotePropertyName 'load' -NotePropertyValue (Get-Random -Minimum 5 -Maximum 40)
        $b = [System.Text.Encoding]::UTF8.GetBytes(($d | ConvertTo-Json -Depth 3))
        $resp.ContentType = 'application/json'
        $resp.ContentLength64 = $b.Length
        $resp.OutputStream.Write($b,0,$b.Length)
    }else{
        $html = Get-HTML
        $b = [System.Text.Encoding]::UTF8.GetBytes($html)
        $resp.ContentType = 'text/html; charset=utf-8'
        $resp.ContentLength64 = $b.Length
        $resp.OutputStream.Write($b,0,$b.Length)
    }
    $resp.Close()
}
}"

pause
