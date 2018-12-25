# Kryptin-Extension
Kryptin helps you to connect with other people who are taking same MOOCs as you.

### Prerequisites
* Install [Kryptin API](https://github.com/BharathKumarRavichandran/kryptin-api)  by following the [project installation](https://github.com/BharathKumarRavichandran/kryptin-api/blob/dev/README.md) instructions.
* Go to `kryptin-api` directory.
* Activate virtual environment - `source venv/bin/activate`
* Start server - `python3 manage.py runserver`

### Build Instructions

1. Clone the repository - `git clone <remote-url>`
2. Go to the directory containing `hosts` file in terminal :
    ```
    cd /etc
    ```
3. Open the `hosts` file using any text editor :
    ```
    sudo gedit hosts
    ```
4. Add `http://www.kryptin.com/` as an alias for `localhost` as shown (in `hosts` file) :
    ```
    127.0.0.1	localhost	http://www.kryptin.com/
    ```
5. Save the `hosts` file.
6. Open Chrome/Chromium browser.
7. Visit [chrome://extensions/](chrome://extensions/) (via omnibox or menu -> Tools -> Extensions).
8. Enable Developer mode by ticking the checkbox in the upper-right corner.
9. Click on the "Load unpacked extension" button.
10. Select the directory containing your unpacked extension.


#### Note
* The extension will work only if the server is running if loaded unpacked.
