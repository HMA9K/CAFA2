"""Current browser regression suite; includes all practice routes and the new reader."""
from pathlib import Path
import runpy
if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).with_name('reader-browser.py')), run_name='__main__')
