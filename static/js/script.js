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
                <p><span class="fw-bold">Price: </span>${data.price} (<span style="color: ${data.stockStatusColor}">${data.stockStatus}</span>)</p>`
                const append = (con) => html = html.concat(con);
                
                if (data.productDetails.length != 0) {
                    append(`<p class="mt-1 fw-bold">Product Details:</p>`);
                    append("<ul style='margin-left: 50px'>")
                    for ([key, value] of data.productDetails){
                        append(`<li class="my-1"><span class="fw-bold">${key}</span> - ${value}</li>`);
                    }
                    append("</ul>")
                }

                const landingImg = document.getElementById("landingImg");
                if (data.landingImg) {
                    landingImg.src = data.landingImg
                }

                const additionalInfo = document.getElementById("additionalInfo");

                if (data.options.length != 0){
                    let infoHTML = `<p class="mt-1 fw-bold">Product Options:</p>`;
                    for (option of data.options){
                        
                    }
                    additionalInfo.innerHTML = infoHTML;
                    additionalInfo.style.background = "white";
                }
                else{
                    additionalInfo.innerHTML = "";
                    additionalInfo.style.background = "transparent";
                }
            }
            
            results.innerHTML = html;
            results.style.background = "white";
        })();
    });
})