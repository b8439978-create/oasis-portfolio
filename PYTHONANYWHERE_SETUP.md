# PythonAnywhere Deploy

1. **https://www.pythonanywhere.com** ga kiring, ro'yxatdan o'ting

2. **Dashboard** → **Web** → **Add a new web app** → **Manual configuration** → Python 3.12

3. **Bash console** oching:

```bash
git clone https://github.com/b8439978-create/oasis-portfolio.git
cd oasis-portfolio
mkvirtualenv --python=python3.12 oasis-env
pip install -r backend/requirements.txt
```

4. **Web** bo'limida WSGI faylni sozlang:
   - `Code` → `WSGI configuration file` ni bosing
   - Hammasini o'chirib, quyidagini yozing:
```python
import sys
import os
path = '/home/REPLACE_WITH_USERNAME/oasis-portfolio/backend'
if path not in sys.path:
    sys.path.append(path)
os.environ['ADMIN_PASSWORD'] = 'oasis123'
from server import app as application
```
   - `REPLACE_WITH_USERNAME` ni o'z username ga almashtiring

5. **Static files** sozlang:
   - `Static files` → `Add`
   - URL: `/`
   - Directory: `/home/REPLACE_WITH_USERNAME/oasis-portfolio/out`

6. **Virtualenv** ni sozlang:
   - `Virtualenv` → `/home/REPLACE_WITH_USERNAME/.virtualenvs/oasis-env`

7. **Reload** tugmasini bosing

8. Tayyor: `https://username.pythonanywhere.com`
