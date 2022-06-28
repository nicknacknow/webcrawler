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
            let html = "";
            
            if (data.status != "ok"){
                html = `<h2>${data.status}</h2>`
            }
            else{
                html = `<h4>${data.name}</h4>
                <style> p {padding: 0; margin: 0; line-height: 20px;} </style>
                <p>Price: ${data.price} (${data.stockStatus})</p>
                <p>Product Details:</p>`

                for ([key, value] of Object.entries(data.productDetails)){
                    html = html.concat(`<p style="padding-left: 50px">•  ${key} - ${value}</p>`);
                  }
            }
            
            results.innerHTML = html;
            results.style.background = "white";
        })();
    });
})