import os
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer # python3
from Config import Config

config = Config()


class HandleRequests(BaseHTTPRequestHandler):
    # contest Dir path
    # cpp template path
    # python template
    # preferred language

    contestDirPath = "/home/san/Desktop/contests"
    count = 1

    def __init__(self, *args):
        super(HandleRequests, self).__init__(*args)

    def log_message(self, format, *args):
        return

    def do_POST(self):
        content_len = int(self.headers.get('content-length', 0))
        jsonBody = json.loads(self.rfile.read(content_len))
        self.runcphelper(jsonBody)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def runcphelper(self, body):
        global config
        workingDir = os.path.join(config.contestDirPath, body["group"])
        Path(workingDir).mkdir(parents=True, exist_ok=True)
        filePath = f"{os.path.join(workingDir, body['name'])}"

        with open(f"{filepath}.cpp", 'w') as f:
            f.write(config.cppTemplate())

        for i, testcase in enumerate(body["tests"], 1):
            with open(f"{filePath}.in{i}", 'w') as f:
                f.write(testcase["input"])
            with open(f"{filePath}.ans{i}", 'w') as f:
                f.write(testcase["output"])
        print(f"{HandleRequests.count} problem{'s' if HandleRequests.count > 1 else ''} parsed")
        HandleRequests.count += 1

config.read()

host = ''
port = 8000

try:
    HTTPServer((host, port), HandleRequests).serve_forever()
except KeyboardInterrupt:
    print("\n\tHappy Coding! Bye.")
