import multiprocessing
import socket
import fcntl
import struct
import os

def get_ip_address(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    return socket.inet_ntoa(
        fcntl.ioctl(
            s.fileno(), 
            0x8915,  # SIOCGIFADDR
            struct.pack('256s', ifname[:15].encode('utf-8'))  # Encode the interface name to bytes
        )[20:24]
    )

ip_address = get_ip_address('eth0')
print(f"IP Address: {ip_address}")

bind = f"{ip_address}:5000"
timeout = 10
preload = True
accesslog = '-'
print_config = True
if (os.getenv('FLASK_ENV') == 'development'):
    print("Running in development mode")
    WEB_RELOAD = True
    loglevel = 'debug'
    workers = 1
else:
    print("Running in production mode")
    loglevel = 'info'
    workers = multiprocessing.cpu_count() * 2
