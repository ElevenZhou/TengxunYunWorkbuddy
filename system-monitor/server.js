const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 获取完整系统信息
app.get('/api/system', async (req, res) => {
    try {
        const [cpu, cpuLoad, memory, disk, network, osInfo, time] = await Promise.all([
            si.cpu(),
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.osInfo(),
            si.time()
        ]);

        res.json({
            success: true,
            data: {
                os: {
                    platform: osInfo.platform,
                    distro: osInfo.distro,
                    release: osInfo.release,
                    arch: osInfo.arch,
                    hostname: osInfo.hostname
                },
                cpu: {
                    manufacturer: cpu.manufacturer,
                    brand: cpu.brand,
                    cores: cpu.cores,
                    physicalCores: cpu.physicalCores,
                    speed: cpu.speed,
                    speedMax: cpu.speedMax,
                    speedMin: cpu.speedMin
                },
                memory: {
                    total: memory.total,
                    used: memory.used,
                    free: memory.free,
                    available: memory.available,
                    usedPercent: (memory.used / memory.total * 100).toFixed(2)
                },
                disk: disk.map(d => ({
                    fs: d.fs,
                    type: d.type,
                    size: d.size,
                    used: d.used,
                    available: d.available,
                    usePercent: d.use
                })),
                network: network.map(n => ({
                    iface: n.iface,
                    ip4: n.ip4,
                    rx: n.rx,
                    tx: n.tx,
                    rxSec: n.rx_sec,
                    txSec: n.tx_sec
                })),
                load: {
                    currentLoad: cpuLoad.currentLoad.toFixed(2),
                    cpus: cpuLoad.cpus.map(c => c.load.toFixed(2))
                },
                uptime: time.uptime
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取简洁信息（用于轮询）
app.get('/api/status', async (req, res) => {
    try {
        const [cpuLoad, memory, disk] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize()
        ]);

        res.json({
            success: true,
            data: {
                cpu: {
                    load: cpuLoad.currentLoad.toFixed(1),
                    cores: cpuLoad.cpus.map(c => c.load.toFixed(1))
                },
                memory: {
                    total: memory.total,
                    used: memory.used,
                    free: memory.free,
                    percent: (memory.used / memory.total * 100).toFixed(1)
                },
                disk: disk.map(d => ({
                    mount: d.fs,
                    usedPercent: d.use.toFixed(1)
                })),
                timestamp: Date.now()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`System Monitor running at http://localhost:${PORT}`);
});
