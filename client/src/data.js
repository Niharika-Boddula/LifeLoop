import { directoryBusinesses } from '../../shared/warangal.js';

export const categories = [
  {name:'Food & grocery',icon:'◉',count:'Local shops'},
  {name:'Mobile & electronics',icon:'▣',count:'Local shops'},
  {name:'Books & stationery',icon:'▤',count:'Local shops'},
  {name:'Fashion & footwear',icon:'✳',count:'Local shops'},
  {name:'Home & furniture',icon:'⌂',count:'Local shops'},
  {name:'Home repair',icon:'⌁',count:'Local services'},
  {name:'Personal care',icon:'♡',count:'Local services'},
];
const images={
 'Mobile shops':'photo-1511707171634-5f897ff02aa9','Electronics':'photo-1498049794561-7780e7231661','Grocery stores':'photo-1542838132-92c53300491e','Furniture & home':'photo-1555041469-a586c61ea9bc','Clothing & footwear':'photo-1445205170230-053b83016050','Department stores':'photo-1441986300917-64674bd600d8','Books & stationery':'photo-1507842217343-583bb7270b66','Books & printing':'photo-1455390582262-044cdead277a','Home & kitchen':'photo-1556911220-e15b29be8c8f','Laptop & computer repair':'photo-1587829741301-dc798b83add3','Mobile repair':'photo-1511707171634-5f897ff02aa9','Mobile & electronics repair':'photo-1511707171634-5f897ff02aa9','Electronics repair':'photo-1581091226825-a6a2a5aee158','Plumbing':'photo-1607472586893-edb57bdc0e39','Electrical & plumbing':'photo-1621905251189-08b45d6a269e','Air conditioning':'photo-1631545806609-7a2c8750dff4','Pest control':'photo-1581578731548-c64695cc6952'
};
const businessImages={
 'pai-mobiles-hanamkonda':'photo-1511707171634-5f897ff02aa9','big-c-mobiles-warangal':'photo-1512499617640-c74ae3a79d37','sangeetha-mobiles-hanamkonda':'photo-1598327105666-5b89351aff97','anil-electronics-hanamkonda':'photo-1498049794561-7780e7231661','more-supermarket-hanamkonda':'photo-1624831466206-5b15053baabb','reliance-smart-hanamkonda':'photo-1542838132-92c53300491e','damro-furniture-hanamkonda':'photo-1555041469-a586c61ea9bc','godrej-interio-hanamkonda':'photo-1493663284031-b7e3aefcae8e','reliance-trends-hanamkonda':'photo-1445205170230-053b83016050','max-fashion-hanamkonda':'photo-1483985988355-763728e1935b','shoppers-stop-warangal':'photo-1441986300917-64674bd600d8','chintala-narasimlu-books':'photo-1507842217343-583bb7270b66','saicharan-bookstall':'photo-1455390582262-044cdead277a','gowin-footwear-hanamkonda':'photo-1542291026-7eec264c27ff','kishore-metal-mart':'photo-1556911220-e15b29be8c8f',
 'aura-laptop-repair':'photo-1587829741301-dc798b83add3','sravan-mobile-repair':'photo-1531297484001-80022131f5a1','realme-service-warangal':'photo-1598327105666-5b89351aff97','mahalaxmi-mobiles-repair':'photo-1510557880182-3d4d3cba35a5','asif-mobile-solutions':'photo-1588872657578-7efd1f1555ed','mi-service-ittech':'photo-1496181133206-80ce9b88a853','neha-mobiles-electronics':'photo-1533228100845-08145b01de14','sanjeeva-cell-repair':'photo-1581091226825-a6a2a5aee158','gs-electronics-service':'photo-1506399558188-acca6f8cbf41','smart-service-center':'photo-1511707171634-5f897ff02aa9','shri-ram-plumbers':'photo-1607472586893-edb57bdc0e39','ks-plumber-services':'photo-1621905251189-08b45d6a269e','rajender-electrical-plumbing':'photo-1621905251189-08b45d6a269e','cool-tech-ac':'photo-1631545806609-7a2c8750dff4','warangal-gnr-pest-control':'photo-1581578731548-c64695cc6952'
};
export const listingImage=(slug,category)=>businessImages[slug]||images[category]||'photo-1441986300917-64674bd600d8';
export const businesses = directoryBusinesses.map((b,index)=>({
  ...b,id:b.slug,_id:b.slug,sample:false,image:listingImage(b.slug,b.category),illustrativePhoto:true,
  rating:0,reviews:0,distance:'',verified:false,listingBadge:b.claimed?'Business claimed':'Public directory listing',
  tags:[b.category,b.city,b.state],accent:['#e7ede5','#f0e8dc','#e5ebf1'][index%3]
}));
export const photo = (id,w=700,h=520) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82`;
