var ctnr = document.getElementById('ctnr');

var mastodonPostUrl = mastodon_object.mastodon_url;
        
ctnr.innerHTML = `<dialog id="comment-dialog">
                    <h3>Reply to this post</h3>
                    <!--<button title="Cancel" id="close">&times;</button>-->
                    <p>
                        To respond to this post, simply enter your mastodon instance below, and add a reply:
                    <p>

                    <p class="input-row">
                        <input type="text" inputmode="url" autocapitalize="none" autocomplete="off"
                            value="${(localStorage.getItem('mastodonUrl') || '')}" id="instanceName"
                            placeholder="mastodon.social">
                        <button class="button" id="go">Go</button>
                    </p>

                    <p>Alternatively, copy this URL and paste it into the search bar of your Mastodon app:</p>
                    <p class="input-row">
                        <input type="text" readonly id="copyInput" value="${mastodonPostUrl}">
                        <button class="button" id="copy">Copy</button>
                    </p>
                </dialog>
                `;

const dialog = document.getElementById('comment-dialog');

// Open dialog on button click
Array.from(document.getElementsByClassName('addComment')).forEach(button => 
    button.addEventListener('click', () => {
        dialog.showModal();
    })
);

// Close dialog on esc-press
dialog.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        dialog.close();
    }
});

// Close dialog, if clicked on backdrop
dialog.addEventListener('click', event => {
    var rect = dialog.getBoundingClientRect();
    var isInDialog =
           rect.top      <= event.clientY 
        && event.clientY <= rect.top + rect.height 
        && rect.left     <= event.clientX 
        && event.clientX <= rect.left + rect.width;
    if (!isInDialog) { 
        dialog.close(); 
    }
})

document.getElementById('go').addEventListener('click', () => {
    let url = document.getElementById('instanceName').value.trim();
    if (url === '') {
        // bail out - window.alert is not very elegant, but it works
        window.alert('Please provide the name of your instance');
        return;
    }
    
    // store the url in the local storage for next time
    localStorage.setItem('mastodonUrl', url);

    if (!url.startsWith('https://')) {
        url = `https://${url}`;
    }

    window.open(`${url}/authorize_interaction?uri=${mastodonPostUrl}`, '_blank');
});

document.getElementById('instanceName').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        document.getElementById('go').dispatchEvent(new Event('click'));
    }
});

document.getElementById('copy').addEventListener('click', () => {
    // select the input field, both for visual feedback, and so that the 
    // user can use CTRL/CMD+C for manual copying
    document.getElementById('copyInput').select();
    navigator.clipboard.writeText(mastodonPostUrl);
    // Confirm this by changing the button text
    document.getElementById('copy').innerHTML = 'Copied!';
    // restore button text after a second.
    window.setTimeout(() => {
        document.getElementById('copy').innerHTML = 'Copy';
    }, 1000);
});
