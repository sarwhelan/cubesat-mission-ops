"""
CubeSat --> Ground Station script.
Polling a specified directory for a CubeSat JSON.
When a JSON is detected in the folder, it does the following activities:
1) Backs up the JSON to the date folder (or creates new date folder) on external drive.
2) Sends a POST request to our ground station server, to be relayed to the app server.
"""

import time, logging, sys, argparse, pathlib, os
import requests
import inotify
from datetime import date
from shutil import copyfile
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Directory consts
DIRECTORY_TO_DUMP = ""

# Args to parse
parser = argparse.ArgumentParser()
parser.add_argument("watch_directory", type=str, help='The absolute directory path to poll for a CubeSat JSON dump.')
parser.add_argument("backup_directory", type=str, help='The absolute directory path to back up CubeSat JSON dumps to.')

# Disable proxy.
os.environ['NO_PROXY'] = '127.0.0.1'

# Observation class to watch whatever directory we care about.
class Watcher():

	def __init__(self):
		self.observer = Observer()

	def run(self, watch_dir):
		poll_handler = PollingHandler()
		self.observer.schedule(poll_handler, watch_dir, recursive=True)
		self.observer.start()
		logging.info("Observation of directory " + watch_dir + " started.")
		try:
			while True:
				time.sleep(5)
		# TO-DO: Add more exception handling.
		except KeyboardInterrupt as e:
			self.observer.stop()
			logging.info("Stopped observation via keyboard interrupt")
		except:
			self.observer.stop()
			logging.error("Unexpected error: " + str(sys.exc_info()[0]))
		self.observer.join()


class PollingHandler(FileSystemEventHandler):

	@staticmethod
	def on_any_event(event):
		i = inotify.adapters.Inotify()
		if event.is_directory:
			return None
		if event.event_type == "created":
			i.add_watch(event.src_path, inotify.constants.IN_CLOSE_WRITE)
			# Log event.
			logging.debug("Received created event - %s." % event.src_path)
			# Copies file to our external drive directory.
			subDirPath = os.path.join(DIRECTORY_TO_DUMP, date.today().strftime("%Y%m%d"))
			if not os.path.isdir(subDirPath):
				pathlib.Path(subDirPath).mkdir(exist_ok=True)
			copyfile(event.src_path, os.path.join(subDirPath, os.path.basename(event.src_path)))
			# Send POST request to GS server.
			pr = requests.post("http://127.0.0.1:3700/cubesat_dump", data=event.src_path)
			logging.debug("POST Request Status: %s %s" % (pr.status_code, pr.reason))


if __name__ == "__main__":
	args = parser.parse_args()
	if args.watch_directory is None or not os.path.isdir(args.watch_directory):
		print("Invalid watch directory entered. Please try again.")
		sys.exit(0)
	elif args.backup_directory is None or not os.path.isdir(args.backup_directory):
		print("Invalid backup directory entered. Please try again.")
		sys.exit(0)
	# Initialize logging. Logs to current desktop.
	logging.basicConfig(level=logging.DEBUG,format='%(pathname)s %(asctime)s %(levelname)s %(message)s',filename= os.path.expanduser("~/Desktop/") + 'dump_watcher.log')
	DIRECTORY_TO_DUMP = args.backup_directory
	w = Watcher()
	w.run(args.watch_directory)
