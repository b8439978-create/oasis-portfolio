import sys
import os

# Repo path (o'z username bilan almashtiring!)
path = '/home/REPLACE_WITH_USERNAME/oasis-portfolio/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['ADMIN_PASSWORD'] = 'oasis123'

from server import app as application
