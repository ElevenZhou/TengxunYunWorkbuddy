import socket
import platform
import os
import subprocess
import json
from datetime import datetime
import threading
import time

# Python 3.11+ 内置 http.server 但功能有限，我们用更简单的方式

def get_system_info():
    """获取系统基本信息"""
    info = {}
    
    # 操作系统信息
    info['os'] = {
        'system': platform.system(),
        'release': platform.release(),
        'version': platform.version(),
        'machine': platform.machine(),
        'processor': platform.processor(),
        'hostname': socket.gethostname()
    }
    
    # CPU 信息
    try:
        result = subprocess.run(['wmic', 'cpu', 'get', 'Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed', '/format:list'], 
                              capture_output=True, text=True, shell=True)
        info['cpu_raw'] = result.stdout
    except:
        pass
    
    # 内存信息
    try:
        result = subprocess.run(['systeminfo'], capture_output=True, text=True, shell=True)
        lines = result.stdout.split('\n')
        for line in lines:
            if 'Total Physical Memory' in line:
                info['memory'] = line.split(':')[1].strip()
            elif 'Available Physical Memory' in line:
                info['memory_available'] = line.split(':')[1].strip()
    except:
        pass
    
    return info

def create_html_response(data):
    """生成 HTML 页面"""
    html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>系统监控面板</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh; color: #fff; padding: 20px;
        }
        .header { text-align: center; padding: 20px; }
        .header h1 {
            font-size: 2rem;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px; max-width: 1200px; margin: 0 auto;
        }
        .card {
            background: rgba(255,255,255,0.05);
            border-radius: 16px; padding: 24px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .card-title {
            font-size: 1.1rem; color: #00d9ff;
            margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 10px;
        }
        .stat-row {
            display: flex; justify-content: space-between;
            padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .stat-label { color: #888; }
        .stat-value { font-weight: 600; color: #fff; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🖥️ 系统监控面板</h1>
        <p>Windows Server 2022 - 实时监控</p>
        <p id="time">''' + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + '''</p>
    </div>
    <div class="grid">
        <div class="card">
            <div class="card-title">系统信息</div>
            <div class="stat-row"><span class="stat-label">操作系统</span><span class="stat-value">''' + data.get('os', {}).get('system', 'N/A') + ' ' + data.get('os', {}).get('release', '') + '''</span></div>
            <div class="stat-row"><span class="stat-label">主机名</span><span class="stat-value">''' + data.get('os', {}).get('hostname', 'N/A') + '''</span></div>
            <div class="stat-row"><span class="stat-label">架构</span><span class="stat-value">''' + data.get('os', {}).get('machine', 'N/A') + '''</span></div>
        </div>
        <div class="card">
            <div class="card-title">内存信息</div>
            <div class="stat-row"><span class="stat-label">总内存</span><span class="stat-value">''' + data.get('memory', 'N/A') + '''</span></div>
            <div class="stat-row"><span class="stat-label">可用内存</span><span class="stat-value">''' + data.get('memory_available', 'N/A') + '''</span></div>
        </div>
        <div class="card">
            <div class="card-title">处理器</div>
            <div class="stat-row"><span class="stat-label">型号</span><span class="stat-value">''' + data.get('os', {}).get('processor', 'N/A')[:50] + '''</span></div>
        </div>
    </div>
    <script>
        setTimeout(() => location.reload(), 5000);
    </script>
</body>
</html>'''
    return html

def handle_request(client_socket):
    """处理 HTTP 请求"""
    try:
        request = client_socket.recv(1024).decode('utf-8')
        
        if 'GET / ' in request or 'GET /api' in request:
            data = get_system_info()
            response = create_html_response(data)
            
            http_response = "HTTP/1.1 200 OK\r\n"
            http_response += "Content-Type: text/html; charset=utf-8\r\n"
            http_response += "Content-Length: " + str(len(response)) + "\r\n"
            http_response += "Connection: close\r\n"
            http_response += "\r\n"
            http_response += response
        else:
            http_response = "HTTP/1.1 404 Not Found\r\n\r\n"
        
        client_socket.sendall(http_response.encode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client_socket.close()

def start_server(port=3000):
    """启动简单的 HTTP 服务器"""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind(('0.0.0.0', port))
    server_socket.listen(5)
    
    print(f"System Monitor running at http://localhost:{port}")
    print("Press Ctrl+C to stop")
    
    try:
        while True:
            client_socket, addr = server_socket.accept()
            thread = threading.Thread(target=handle_request, args=(client_socket,))
            thread.start()
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        server_socket.close()

if __name__ == '__main__':
    start_server(3000)
