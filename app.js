const puppeteer = require('puppeteer');
const express = require('express');
const validUrl = require('valid-url');
const { text } = require('express');
const app = express();
const port = 3000;

async function AmazonProductDetails(link) {
  if (!validUrl.isUri(link)){
    return {status: "invalid link"}
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  await page.waitForSelector("#productTitle");
  let element = await page.$("#productTitle");
  let title = (await page.evaluate(el => el.textContent, element)).trim();

  console.log(title);

  /*
    to-do:
        discounts
  */

  //let priceData = JSON.parse(await page.evaluate(() => document.getElementsByClassName("twister-plus-buying-options-price-data")[0].innerHTML))[0];
  //let price = priceData.displayPrice;
  //console.log(price);

  let price = await page.evaluate(() => document.querySelector(".a-price .a-offscreen").textContent)
  console.log(price);

  //let ratingElement = await page.evaluate(() => document.querySelector(".a-icon-star span"))
  await page.waitForSelector("#averageCustomerReviews_feature_div");
  let reviewElement = await page.$("#averageCustomerReviews_feature_div");
  let ratingElement = await page.evaluate(el => el.querySelector(".a-icon-alt"), reviewElement);
  
  let rating = "Ratings Unavailable";
  let numOfRatings = "0";

  if (ratingElement) {
    rating = await page.evaluate(el => el.querySelector(".a-icon-alt").textContent, reviewElement);
    numOfRatings = await page.evaluate(el => el.querySelector("#acrCustomerReviewText").textContent, reviewElement);

    //await page.waitForSelector("#acrCustomerReviewText");
    //let numOfRatingsElement = await page.$("#acrCustomerReviewText");
    //numOfRatings = await page.evaluate(el => el.textContent, numOfRatingsElement);
  }

  console.log(rating);
  console.log(numOfRatings);
  
  await page.waitForSelector("#imageBlock");
  let imageBlock = await page.$("#imageBlock");
  let landingImageSrc = await page.evaluate(el => el.querySelector(".a-dynamic-image").src, imageBlock);
  console.log(landingImageSrc);

  let optionListData = [];

  //await page.waitForSelector("#twister");
  let optionTwister = await page.$("#twister");
  if (optionTwister) {
    let twisterMethod = await page.evaluate(el => el.method, optionTwister)
    if (twisterMethod) { // check if there are any variations

        optionListData = await page.evaluate(el => {
          let data = []; // contains info about each div
          let divs = el.querySelectorAll(".a-section");

          for (div of divs){
            let option = {};
            option["type"] = div.querySelector(".a-row .a-form-label").textContent.trim().replace(":", "");
            option["current"] = div.querySelector(".a-row .selection").textContent;
            option["options"] = [];

            let listItems = div.querySelectorAll("ul li");
            for (listItem of listItems){
              let optionData = {};
              
              let button = listItem.querySelector(".a-button-text");

              let titleElement = button.querySelector(".twisterTextDiv p");
              if (titleElement){
                optionData["title"] = titleElement.textContent.trim();
              }
              
              let priceElement = button.querySelector(".twisterSlotDiv span p");
              if (priceElement){
                optionData["price"] = priceElement.textContent.trim();
              }
              
              let imgElement = button.querySelector("img");
              if (imgElement){
                optionData["src"] = imgElement.src;
                optionData["alt"] = imgElement.alt;
              }

              option["options"].push(optionData);
            }

            data.push(option);
          }

          return data;
        }, optionTwister);
        
        for (i of optionListData){
          console.log(i);
        }
    }
  }

  await page.waitForSelector("#productOverview_feature_div");
  let productOverviewElement = await page.$("#productOverview_feature_div");
  let overviewTbody = await page.evaluate(el => el.querySelector("tbody"), productOverviewElement);
  
  let productOverviewDetails = {}
  if (overviewTbody){
    console.log("ok");
    productOverviewDetails = await page.evaluate(el => {
      let data = {};
      let tds = el.querySelector("tbody").querySelectorAll("td");
      
      for (let i = 0; i < tds.length; i++){
        data[tds[i].querySelector("span").textContent] = tds[i++ + 1].querySelector("span").textContent;
      }
      return data;
    }, productOverviewElement);
  }

  for ([key, value] of Object.entries(productOverviewDetails)){
    console.log(`${key} = ${value}`);
  }

  //const attr = await page.evaluate(el => getComputedStyle(el, "#price").getPropertyValue("color"), priceElement);
  //const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
  //console.log(rgb2hex(attr));

  await page.waitForSelector("#availability");
  let availabilityElement = await page.$("#availability span")
  
  let stockStatus = (await page.evaluate(el => el.textContent, availabilityElement)).trim();
  
  console.log(stockStatus.trim());

  await browser.close();
  const data = {status: "ok", inStock: stockStatus.trim() == "In stock.", price: price, name: title};
  return await data;
}

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(__dirname + "/static"));

app.post('/submit-form', async function(req, res)
{
  const link = req.body.amazonLink;

  const details = await AmazonProductDetails(link);

  res.send(JSON.stringify(details)) //return JSON.stringify({body: "123"}); //AmazonProductDetails(link.amazonLink);
  res.end();
});

app.get('/', function(req, res)
{
  res.render("index");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

// https://www.amazon.co.uk/Ends-Us-Colleen-Hoover/dp/1471156265
//AmazonProductDetails('https://www.amazon.co.uk/Ends-Us-Colleen-Hoover/dp/1471156265?ref_=Oct_d_obs_d_266239&pd_rd_w=XUYQL&content-id=amzn1.sym.f846ee14-1ba8-4e8b-880b-8fd2aa9e3010&pf_rd_p=f846ee14-1ba8-4e8b-880b-8fd2aa9e3010&pf_rd_r=TDSBS24W2RDDKS1AFB7V&pd_rd_wg=mFqTA&pd_rd_r=22902c4e-937a-4379-8063-eeda5be68084&pd_rd_i=1471156265');
