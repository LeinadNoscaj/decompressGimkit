const GIMKIT_ASSET_BASE_URL = 'https://www.gimkit.com/assets/map/characters/spine/';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

async function decompressAndOutput() {
    const urlParams = new URLSearchParams(window.location.search);
    const filenameBase = urlParams.get('filename');

    if (!filenameBase) {
        document.contentType = 'text/plain';
        document.body.textContent = JSON.stringify({ error: 'No filename parameter provided.' });
        return;
    }

    const filenameWithExtension = filenameBase + '.json';
    const jsonUrl = GIMKIT_ASSET_BASE_URL + filenameWithExtension;

    try {
        const response = await fetch(CORS_PROXY_URL + jsonUrl);
        if (!response.ok) {
            document.contentType = 'text/plain';
            document.body.textContent = JSON.stringify({ error: `HTTP error! status: ${response.status}` });
            return;
        }
        const fetchedData = await response.json();
        const decompressedObject = compressJSON.decompress(fetchedData);
        const decompressedJsonString = JSON.stringify(decompressedObject);

        document.contentType = 'text/plain';
        document.body.textContent = decompressedJsonString;

    } catch (error) {
        document.contentType = 'text/plain';
        document.body.textContent = JSON.stringify({ error: error.message });
    }
}

decompressAndOutput();
