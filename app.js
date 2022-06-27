const puppeteer = require('puppeteer');



(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.amazon.co.uk/Ends-Us-Colleen-Hoover/dp/1471156265?ref_=Oct_d_obs_d_266239&pd_rd_w=XUYQL&content-id=amzn1.sym.f846ee14-1ba8-4e8b-880b-8fd2aa9e3010&pf_rd_p=f846ee14-1ba8-4e8b-880b-8fd2aa9e3010&pf_rd_r=TDSBS24W2RDDKS1AFB7V&pd_rd_wg=mFqTA&pd_rd_r=22902c4e-937a-4379-8063-eeda5be68084&pd_rd_i=1471156265');
  await page.waitForSelector("#productTitle");
  let element = await page.$("#productTitle");
  let value = await page.evaluate(el => el.textContent, element);

  console.log(value.trim());

  await page.waitForSelector("#price");
  let priceElement = await page.$("#price")
  let price = await page.evaluate(el => el.textContent, priceElement);

  const attr = await page.evaluate(el => getComputedStyle(el, "#price").getPropertyValue("color"), priceElement);

  const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

  console.log(price);
  console.log(rgb2hex(attr));

  await page.waitForSelector("#availability");
  let availabilityElement = await page.$("#availability span")
  
  let isInStock = await page.evaluate(el => el.textContent, availabilityElement);
  
  console.log(isInStock.trim());

  await browser.close();
})();