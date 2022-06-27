window.addEventListener("DOMContentLoaded", function(event){
    document.querySelector("#AmazonLinkForm").addEventListener("submit", function(event)
    {
        var formData = new FormData(document.querySelector("#AmazonLinkForm"));
        event.preventDefault();

        (async () => {
            const response = await fetch("/submit-form", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify((formData.values()))
            });
            const content = await response.json();
            console.log("reply : " + content);
        })();
    });
})