#!/usr/bin/env python3
"""
Server lifecycle manager for webapp testing.

Usage:
    python with_server.py --server "npm run dev" --port 5173 -- python test.py
    python with_server.py --server "cd backend && python app.py" --port 3000 \
                          --server "cd frontend && npm run dev" --port 5173 \
                          -- python test.py

Options:
    --server CMD    Server command to run (can be specified multiple times)
    --port PORT     Port to wait for (must follow each --server)
    --timeout SEC   Max seconds to wait for each server (default: 60)
    --help          Show this help message
"""

import argparse
import subprocess
import sys
import time
import socket
from contextlib import contextmanager
from typing import List, Tuple


def wait_for_port(port: int, timeout: int = 60) -> bool:
    """Wait for a port to become available."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                s.connect(('localhost', port))
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            time.sleep(0.5)
    return False


@contextmanager
def managed_servers(servers: List[Tuple[str, int]], timeout: int = 60):
    """Context manager to start and stop multiple servers."""
    processes = []
    try:
        for cmd, port in servers:
            print(f"Starting server: {cmd} (waiting for port {port})")
            proc = subprocess.Popen(
                cmd,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                preexec_fn=lambda: __import__('os').setsid()
            )
            processes.append(proc)
            
            if not wait_for_port(port, timeout):
                raise RuntimeError(f"Server failed to start on port {port}")
            print(f"Server ready on port {port}")
        
        yield processes
        
    finally:
        import os
        import signal
        for proc in processes:
            try:
                os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
                proc.wait(timeout=5)
            except Exception:
                try:
                    os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
                except Exception:
                    pass


def main():
    parser = argparse.ArgumentParser(
        description="Manage server lifecycle for testing",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('--server', action='append', dest='servers',
                        help='Server command (can be repeated)')
    parser.add_argument('--port', action='append', dest='ports', type=int,
                        help='Port to wait for (must follow each --server)')
    parser.add_argument('--timeout', type=int, default=60,
                        help='Timeout in seconds (default: 60)')
    parser.add_argument('command', nargs='*',
                        help='Command to run after servers are ready')
    
    args = parser.parse_args()
    
    if not args.servers:
        parser.print_help()
        sys.exit(1)
    
    if not args.ports or len(args.servers) != len(args.ports):
        print("Error: Each --server must be followed by a --port")
        sys.exit(1)
    
    if not args.command:
        print("Error: No command specified after --")
        sys.exit(1)
    
    servers = list(zip(args.servers, args.ports))
    
    with managed_servers(servers, args.timeout):
        cmd = ' '.join(args.command)
        print(f"\nRunning: {cmd}\n")
        result = subprocess.run(cmd, shell=True)
        sys.exit(result.returncode)


if __name__ == '__main__':
    main()
