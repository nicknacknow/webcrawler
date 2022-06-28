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
                body: JSON.stringify(Object.fromEntries(formData))
            });
            const res = await response;
            const json = await res.json();
            const data = await json;

            const results = document.getElementById("results");
            let html = `<h2>${data.name}</h2>`
            
            if (data.status != "ok"){
                html = `<h2>${data.status}</h2>`
            }
            else{
                console.log(data.inStock);
            }
            
            results.innerHTML = html;
            results.style.background = "white";
        })();
    });
})