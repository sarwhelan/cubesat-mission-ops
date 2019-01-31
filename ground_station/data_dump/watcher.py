import time, logging, sys
from os import path
from shutil import copyfile
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Directory consts
WORKING_DIR = ""
DIRECTORY_TO_WATCH = ""
DIRECTORY_TO_DUMP = ""

# Observation class to watch whatever directory we care about.
class Watcher():

	def __init__(self):
		self.observer = Observer()

	def run(self):
		poll_handler = PollingHandler()
		self.observer.schedule(poll_handler, DIRECTORY_TO_WATCH, recursive=True)
		self.observer.start()
		msg = "Observation of directory " + DIRECTORY_TO_WATCH + " started."
		print(msg)
		logging.info(msg)
		try:
			while True:
				time.sleep(5)
		except KeyboardInterrupt as e: # swallow
			self.observer.stop()
			logging.info("Stopped observation via keyboard interrupt")
		except:
			self.observer.stop()
			# Kinda spammy, need to add keyboard interrupt handling here
			logging.error("Unexpected error: " + str(sys.exc_info()[0]))

		self.observer.join()


class PollingHandler(FileSystemEventHandler):

	@staticmethod
	def on_any_event(event):
		if event.is_directory:
			return None
		if event.event_type == "created":
			logging.debug("Received created event - %s." % event.src_path)
			# Copies file to our external drive, but right now just a dump dir
			copyfile(event.src_path, path.join(DIRECTORY_TO_DUMP, path.basename(event.src_path)))


if __name__ == "__main__":
	if len(sys.argv) < 2:
		print("Required: working directory argument.")
		sys.exit(0)
	WORKING_DIR = sys.argv[1]
	# Initialize logging. 
	logging.basicConfig(level=logging.DEBUG,
	                    format='%(pathname)s %(asctime)s %(levelname)s %(message)s',
	                    filename= WORKING_DIR + 'watcher.log'
	                    )
	DIRECTORY_TO_WATCH = path.join(WORKING_DIR, "watch_test")
	DIRECTORY_TO_DUMP = path.join(WORKING_DIR, "dump_test")
	w = Watcher()
	w.run()