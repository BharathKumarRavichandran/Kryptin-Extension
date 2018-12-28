# Kryptin-Extension
Kryptin helps you to connect with other people who are taking same MOOCs as you.

### Prerequisites
* Install [Kryptin API](https://github.com/BharathKumarRavichandran/kryptin-api)  by following the [project installation](https://github.com/BharathKumarRavichandran/kryptin-api/blob/dev/README.md) instructions.
* Go to `kryptin-api` directory.
* Activate virtual environment - `source venv/bin/activate`
* Start sslserver(`https://`) - `python3 manage.py runsslserver`
* Start websocket protocol server(`wss://`) : 
    ```
    daphne -e ssl:8001:privateKey=pyOpenSSL.key:certKey=pyOpenSSL.crt Kryptin.asgi:application
    ```

### Build Instructions

1. Clone the repository - `git clone <remote-url>`
2. Open Chrome/Chromium browser.
3. Visit [chrome://extensions/](chrome://extensions/) (via omnibox or menu -> Tools -> Extensions).
4. Enable Developer mode by ticking the checkbox in the upper-right corner.
5. Click on the "Load unpacked extension" button.
6. Select the directory containing your unpacked extension.


#### Note
* The extension will work only if the server is running if loaded unpacked.
