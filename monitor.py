import os
import time
import shutil
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import zipfile
from dotenv import load_dotenv
import subprocess
from pathlib import Path
import sys
import threading
from datetime import datetime

# Load environment variables
load_dotenv()
PROJECT_NAME = os.getenv('PROJECT_NAME')

class Spinner:
    def __init__(self):
        self.spinning = False
        self.spinner_chars = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        self.current_char = 0
        self.last_status = ""
        self.terminal_width = self._get_terminal_width()

    def _get_terminal_width(self):
        try:
            return os.get_terminal_size().columns
        except OSError:
            return 80

    def _truncate_message(self, message, max_length):
        if len(message) <= max_length:
            return message
        return message[:max_length-3] + "..."

    def spin(self):
        while self.spinning:
            self.current_char = (self.current_char + 1) % len(self.spinner_chars)
            current_time = datetime.now().strftime("%H:%M:%S")
            base_status = f"{self.spinner_chars[self.current_char]} [{current_time}] Waiting for new zip file..."
            available_space = self.terminal_width - len(base_status) - 5
            
            status = base_status
            if self.last_status and available_space > 10:
                last_status = self._truncate_message(self.last_status, available_space)
                status = f"{base_status} ({last_status})"

            sys.stdout.write('\r' + ' ' * self.terminal_width + '\r')
            sys.stdout.write(status)
            sys.stdout.flush()
            time.sleep(0.1)

    def start(self):
        self.spinning = True
        threading.Thread(target=self.spin, daemon=True).start()

    def stop(self, status=""):
        self.spinning = False
        sys.stdout.write('\r' + ' ' * self.terminal_width + '\r')
        if status:
            current_time = datetime.now().strftime("%H:%M:%S")
            print(f"[{current_time}] ✓ {status}")
            self.last_status = self._truncate_message(status, 50)

class ZipHandler(FileSystemEventHandler):
    def __init__(self, root_path):
        self.root_path = root_path
        self.archive_path = os.path.join(root_path, 'archive')
        self.extract_path = os.path.join(root_path)
        self.current_version = 0
        self.spinner = Spinner()
        self.last_processed_zip = None
        
        # Create necessary directories
        os.makedirs(self.archive_path, exist_ok=True)
        os.makedirs(self.extract_path, exist_ok=True)
        
        # Create .gitignore
        self.create_gitignore()
        
        # Set initial version based on existing archives
        self._update_current_version()

    def create_gitignore(self):
        gitignore_path = os.path.join(self.root_path, '.gitignore')
        if not os.path.exists(gitignore_path):
            with open(gitignore_path, 'w') as f:
                f.write("archive/\n*.zip\n")

    def is_zip_file(self, path):
        return path.endswith('.zip')

    def archive_zip(self, src_path):
        filename = os.path.basename(src_path)
        if not filename.startswith(PROJECT_NAME):
            # Ensure archive directory exists
            os.makedirs(self.archive_path, exist_ok=True)
            
            version = self.current_version + 1
            archived_name = f"{PROJECT_NAME}-v{version}.zip"
            archived_path = os.path.join(self.archive_path, archived_name)
            shutil.copy2(src_path, archived_path)
            self.current_version = version
            return archived_path
        return None

    def extract_zip(self, zip_path):
        try:
            # Files to preserve
            preserve_files = ['.env', 'monitor.py', '.git', '.gitignore']
            
            # Backup preserved files
            preserved_contents = {}
            for file in preserve_files:
                file_path = os.path.join(self.extract_path, file)
                if os.path.exists(file_path):
                    if os.path.isdir(file_path):
                        preserved_contents[file] = shutil.copytree(file_path, file_path + '_backup', dirs_exist_ok=True)
                    else:
                        preserved_contents[file] = shutil.copy2(file_path, file_path + '_backup')

            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Extract all files except preserved ones
                for file_info in zip_ref.filelist:
                    filename = os.path.basename(file_info.filename)
                    if filename in preserve_files:
                        continue
                    
                    # Get the file path relative to the first directory in the zip
                    parts = file_info.filename.split('/')
                    if len(parts) > 1:
                        # Skip the first directory (if it exists) but keep the rest of the path
                        relative_path = '/'.join(parts[1:]) if parts[0] else file_info.filename
                    else:
                        relative_path = file_info.filename

                    # Create target path in root directory
                    target_path = os.path.join(self.extract_path, relative_path)
                    
                    # Create directories if needed
                    os.makedirs(os.path.dirname(target_path), exist_ok=True)
                    
                    # Extract the file
                    if not file_info.filename.endswith('/'):  # Skip directories
                        content = zip_ref.read(file_info.filename)
                        with open(target_path, 'wb') as f:
                            f.write(content)

            # Restore preserved files
            for file, backup_path in preserved_contents.items():
                original_path = os.path.join(self.extract_path, file)
                if os.path.exists(backup_path):
                    if os.path.isdir(backup_path):
                        if os.path.exists(original_path):
                            shutil.rmtree(original_path)
                        shutil.copytree(backup_path, original_path, dirs_exist_ok=True)
                        shutil.rmtree(backup_path)
                    else:
                        shutil.move(backup_path, original_path)

            return True
        except Exception as e:
            self.spinner.stop(f"Failed to extract zip: {str(e)}")
            return False

    def handle_git(self):
        try:
            self.spinner.stop("Processing git operations...")
            git_dir = os.path.join(self.extract_path, '.git')
            
            # First time setup if .git doesn't exist
            if not os.path.exists(git_dir):
                commands = [
                    ['git', 'init'],
                    ['git', 'remote', 'add', 'origin', f'git@github.com:jalil0seth/{PROJECT_NAME}.git'],
                    ['git', 'add', '.'],
                    ['git', 'commit', '-m', "first push"],
                    ['git', 'branch', '-M', 'main'],
                    ['git', 'push', '-u', 'origin', 'main']
                ]
            else:
                # Regular push for existing repository
                commands = [
                    ['git', 'add', '.'],
                    ['git', 'commit', '-m', f'v{self.current_version}'],
                    ['git', 'branch', '-M', 'main'],  # Ensure we're on main branch
                    ['git', 'push', '-f', 'origin', 'main']
                ]
            
            # Execute commands
            for cmd in commands:
                result = subprocess.run(cmd, cwd=self.extract_path, capture_output=True, text=True)
                if result.returncode != 0 and 'nothing to commit' not in result.stderr:
                    error_msg = result.stderr.strip()
                    if 'nothing to commit' in error_msg:
                        continue
                    self.spinner.stop(f"Git command failed: {error_msg}")
                    return False
            
            self.spinner.stop("Git operations completed successfully")
            return True
            
        except Exception as e:
            self.spinner.stop(f"Git error: {str(e)}")
            return False

    def _update_current_version(self):
        try:
            # Get all zip files in archive directory
            zip_files = [f for f in os.listdir(self.archive_path) if f.endswith('.zip')]
            if zip_files:
                versions = [int(f.split('-v')[-1].split('.')[0]) for f in zip_files if '-v' in f]
                self.current_version = max(versions) if versions else 0
        except Exception:
            self.current_version = 0

    def on_created(self, event):
        if not self.is_zip_file(event.src_path):
            return
            
        if event.src_path == self.last_processed_zip:
            return
            
        self.last_processed_zip = event.src_path
        
        # Wait a bit to ensure the file is completely written
        time.sleep(1)
        
        self.spinner.stop(f"New zip detected: {os.path.basename(event.src_path)}")
        
        # Archive the zip
        archived_path = self.archive_zip(event.src_path)
        if archived_path:
            self.spinner.stop("Processing zip file...")
            
            # Extract the zip
            if self.extract_zip(event.src_path):
                self.spinner.stop(f"Files extracted and archived as {os.path.basename(archived_path)}")
                
                # Handle git operations
                self.handle_git()
            
        self.spinner.start()

def main():
    # Setup paths
    root_path = os.path.dirname(os.path.abspath(__file__))
    
    # Print startup information
    print(f"\n{'='*50}")
    print(f"Starting file monitor")
    print(f"Project name: {PROJECT_NAME}")
    print(f"Monitoring directory: {root_path}")
    print(f"{'='*50}\n")

    # Create and start the handler
    event_handler = ZipHandler(root_path)
    observer = Observer()
    observer.schedule(event_handler, root_path, recursive=False)
    observer.start()

    # Start the spinner
    event_handler.spinner.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        event_handler.spinner.stop("Monitoring stopped")
        observer.stop()
        observer.join()

if __name__ == "__main__":
    main()