// ============================================
// PriceAlert.live — Countries & Stores Data
// ============================================

export const COUNTRIES = {
  US: { name:"United States", currency:"USD", symbol:"$",   rate:1,    flag:"🇺🇸", gl:"us", hl:"en" },
  PK: { name:"Pakistan",      currency:"PKR", symbol:"₨",   rate:278,  flag:"🇵🇰", gl:"pk", hl:"en" },
  IN: { name:"India",         currency:"INR", symbol:"₹",   rate:83,   flag:"🇮🇳", gl:"in", hl:"en" },
  GB: { name:"UK",            currency:"GBP", symbol:"£",   rate:0.79, flag:"🇬🇧", gl:"gb", hl:"en" },
  AE: { name:"UAE",           currency:"AED", symbol:"د.إ", rate:3.67, flag:"🇦🇪", gl:"ae", hl:"en" },
  SA: { name:"Saudi Arabia",  currency:"SAR", symbol:"﷼",   rate:3.75, flag:"🇸🇦", gl:"sa", hl:"ar" },
  DE: { name:"Germany",       currency:"EUR", symbol:"€",   rate:0.92, flag:"🇩🇪", gl:"de", hl:"de" },
  AU: { name:"Australia",     currency:"AUD", symbol:"A$",  rate:1.53, flag:"🇦🇺", gl:"au", hl:"en" },
  CA: { name:"Canada",        currency:"CAD", symbol:"C$",  rate:1.36, flag:"🇨🇦", gl:"ca", hl:"en" },
  JP: { name:"Japan",         currency:"JPY", symbol:"¥",   rate:149,  flag:"🇯🇵", gl:"jp", hl:"ja" },
  BD: { name:"Bangladesh",    currency:"BDT", symbol:"৳",   rate:110,  flag:"🇧🇩", gl:"bd", hl:"en" },
  NG: { name:"Nigeria",       currency:"NGN", symbol:"₦",   rate:1550, flag:"🇳🇬", gl:"ng", hl:"en" },
  BR: { name:"Brazil",        currency:"BRL", symbol:"R$",  rate:4.97, flag:"🇧🇷", gl:"br", hl:"pt" },
  EG: { name:"Egypt",         currency:"EGP", symbol:"£",   rate:48,   flag:"🇪🇬", gl:"eg", hl:"ar" },
  TR: { name:"Turkey",        currency:"TRY", symbol:"₺",   rate:32,   flag:"🇹🇷", gl:"tr", hl:"tr" },
};

export const STORES = [
  { name:"Amazon",     icon:"📦", color:"#FF9900", trust:99, badge:"#1 Global",   available:["US","GB","DE","AU","CA","JP","IN","AE","SA","BR","EG","TR"],                        shipping:{ US:"Free (Prime)", GB:"£2.99+", DE:"€3.99+", AU:"A$6.99+", CA:"C$4.99+", JP:"¥500+", IN:"₹40+", AE:"Free AED100+", SA:"Free SAR100+", default:"Varies" }, url:(q,c)=>`https://www.amazon.${c==="GB"?"co.uk":c==="JP"?"co.jp":c==="IN"?"in":c==="AU"?"com.au":c==="CA"?"ca":c==="DE"?"de":c==="AE"?"ae":c==="SA"?"sa":c==="BR"?"com.br":c==="EG"?"eg":c==="TR"?"com.tr":"com"}/s?k=${encodeURIComponent(q)}` },
  { name:"eBay",       icon:"🛒", color:"#0064D2", trust:95, badge:"Top Rated",   available:["US","GB","DE","AU","CA","JP","IN","AE","SA","TR","BR","EG","PK","BD"],              shipping:{ US:"Free+", GB:"Free+", DE:"€2.99+", default:"Varies" },                                                                                                                         url:(q)=>`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}` },
  { name:"AliExpress", icon:"🚀", color:"#FF4747", trust:87, badge:"Cheapest",    available:["US","GB","DE","AU","CA","JP","IN","AE","SA","PK","BD","NG","BR","EG","TR"],          shipping:{ US:"$1.99+", PK:"₨299+", IN:"₹99+", AE:"Free+", default:"$2.99+" },                                                                                                             url:(q)=>`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}` },
  { name:"Walmart",    icon:"🏪", color:"#0071CE", trust:97, badge:"US #1",       available:["US","CA","GB"],                                                                       shipping:{ US:"Free $35+", CA:"C$9.99+", default:"Not Available" },                                                                                                                         url:(q)=>`https://www.walmart.com/search?q=${encodeURIComponent(q)}` },
  { name:"Flipkart",   icon:"⭐", color:"#2874F0", trust:93, badge:"India #1",    available:["IN","BD"],                                                                            shipping:{ IN:"Free ₹500+", default:"Not Available" },                                                                                                                                      url:(q)=>`https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  { name:"Noon",       icon:"🌞", color:"#FECC00", trust:90, badge:"Gulf #1",     available:["AE","SA","EG"],                                                                       shipping:{ AE:"Free AED100+", SA:"Free SAR100+", EG:"Free EGP500+", default:"Not Available" },                                                                                            url:(q)=>`https://www.noon.com/uae-en/search/?q=${encodeURIComponent(q)}` },
  { name:"Daraz",      icon:"🛍️", color:"#F85606", trust:88, badge:"S.Asia #1",  available:["PK","BD"],                                                                            shipping:{ PK:"Free ₨1000+", BD:"৳50+", default:"Not Available" },                                                                                                                         url:(q)=>`https://www.daraz.pk/catalog/?q=${encodeURIComponent(q)}` },
  { name:"Best Buy",   icon:"🔵", color:"#003876", trust:96, badge:"US Tech",     available:["US","CA"],                                                                            shipping:{ US:"Free $35+", CA:"C$7.99+", default:"Not Available" },                                                                                                                         url:(q)=>`https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(q)}` },
  { name:"Newegg",     icon:"💻", color:"#E2581F", trust:92, badge:"Tech #1",     available:["US","CA","GB","AU","DE","JP","AE"],                                                   shipping:{ US:"Free+", CA:"C$4.99+", default:"Varies" },                                                                                                                                    url:(q)=>`https://www.newegg.com/p/pl?d=${encodeURIComponent(q)}` },
  { name:"Jumia",      icon:"🌍", color:"#F68B1E", trust:85, badge:"Africa #1",   available:["NG","EG"],                                                                            shipping:{ NG:"Free ₦5000+", EG:"Free EGP200+", default:"Not Available" },                                                                                                                url:(q)=>`https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(q)}` },
  { name:"Rakuten",    icon:"🇯🇵", color:"#BF0000", trust:91, badge:"Japan #1",   available:["JP","US","GB","DE","AU","CA","AE"],                                                   shipping:{ JP:"Free ¥3240+", US:"$4.99+", default:"Varies" },                                                                                                                              url:(q)=>`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(q)}/` },
  { name:"Target",     icon:"🎯", color:"#CC0000", trust:94, badge:"US Retail",   available:["US"],                                                                                  shipping:{ US:"Free $35+", default:"Not Available" },                                                                                                                                       url:(q)=>`https://www.target.com/s?searchTerm=${encodeURIComponent(q)}` },
  { name:"Temu",       icon:"🟠", color:"#FF6200", trust:82, badge:"Ultra Cheap", available:["US","GB","DE","AU","CA","JP","IN","AE","SA","PK","BD","NG","BR","EG","TR"],           shipping:{ default:"Free" },                                                                                                                                                                url:(q)=>`https://www.temu.com/search_result.html?search_key=${encodeURIComponent(q)}` },
  { name:"Shein",      icon:"👗", color:"#222222", trust:83, badge:"Fashion",     available:["US","GB","DE","AU","CA","IN","AE","SA","PK","BR","TR","EG","BD","NG"],               shipping:{ US:"Free $29+", PK:"Free", IN:"Free ₹999+", default:"Free+" },                                                                                                                   url:(q)=>`https://www.shein.com/pdsearch/${encodeURIComponent(q)}/` },
  { name:"Mercado",    icon:"🛒", color:"#FFE600", trust:86, badge:"LatAm #1",    available:["BR"],                                                                                  shipping:{ BR:"Free R$79+", default:"Not Available" },                                                                                                                                      url:(q)=>`https://listado.mercadolibre.com.br/${encodeURIComponent(q)}` },
];

export const TRENDING = [
  "iPhone 16 Pro","Samsung Galaxy S25","PS5 Console","AirPods Pro 2",
  "Nike Air Max","MacBook Air M3","Sony WH-1000XM5","iPad Pro",
  "Gaming Chair","Smart Watch","RTX 4070","Dyson Vacuum",
];

export const CATEGORIES = [
  { label:"Electronics", icon:"📱", q:"smartphone electronics" },
  { label:"Gaming",      icon:"🎮", q:"gaming console" },
  { label:"Fashion",     icon:"👟", q:"shoes clothing" },
  { label:"Home",        icon:"🏠", q:"home appliance" },
  { label:"Beauty",      icon:"💄", q:"beauty skincare" },
  { label:"Sports",      icon:"⚽", q:"sports fitness" },
  { label:"Books",       icon:"📚", q:"books bestseller" },
  { label:"Toys",        icon:"🧸", q:"toys kids" },
];
