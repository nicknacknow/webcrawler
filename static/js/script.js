window.addEventListener("DOMContentLoaded", function(event){
    document.querySelector("#AmazonLinkForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        var formData = new FormData(document.querySelector("#AmazonLinkForm"));
        var options = {body: formData, method: "POST", cache: 'no-cache'};
        console.log(Array.from(formData));
        
        fetch("/submit-form", options).then(function(response){
            return response;
        }).then(function(data){
            console.log(data);
        }).catch(function(err){console.log(err);})
        //event.currentTarget.submit(event);
    });
})