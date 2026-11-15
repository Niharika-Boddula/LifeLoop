import bcrypt from 'bcryptjs';
import { directoryBusinesses } from '../../shared/warangal.js';
import {User,Business,Product} from './models.js';

const estimate=(name,price,description)=>({name,price,currency:'INR',description,kind:'product',availability:'unknown',priceNote:'Illustrative reference price only — confirm the current price and stock with the business.'});
const shopExamples={
 'Mobile shops':[estimate('Basic phone case',299,'Illustrative accessory price; model and brand change the price.'),estimate('Tempered glass screen protector',99,'Illustrative accessory price; fitting may cost extra.'),estimate('USB-C charging adapter',499,'Illustrative accessory price; confirm device compatibility.')],
 'Electronics':[estimate('Wired earphones',399,'Illustrative entry-level price; model and brand change the price.'),estimate('Power strip',399,'Illustrative item price; confirm stock and specifications.')],
 'Grocery stores':[estimate('Rice, 1 kg',70,'Illustrative local reference rate; grain and brand affect the price.'),estimate('Cooking oil, 1 litre',160,'Illustrative local reference rate; brand and type affect the price.')],
 'Furniture & home':[estimate('Basic side table',1999,'Illustrative reference item; size, material and assembly change the price.'),estimate('Plastic chair',799,'Illustrative reference item; confirm current stock and price.')],
 'Clothing & footwear':[estimate('Everyday apparel',499,'Illustrative starting estimate; style, size and brand change the price.'),estimate('Casual footwear',699,'Illustrative starting estimate; style and brand change the price.')],
 'Department stores':[estimate('Everyday clothing',499,'Illustrative starting estimate; brand and product determine the price.')],
 'Books & stationery':[estimate('Ruled notebook',60,'Illustrative stationery reference; size and page count change the price.'),estimate('Ballpoint pen',10,'Illustrative stationery reference; brand and pack size change the price.')],
 'Books & printing':[estimate('A4 black-and-white photocopy, per page',2,'Illustrative local reference rate; paper size and quantity may change the price.'),estimate('A4 colour print, per page',10,'Illustrative local reference rate; coverage and paper may change the price.')],
 'Home & kitchen':[estimate('Stainless-steel kitchen utensil',199,'Illustrative starting estimate; size, weight and material change the price.')]
};
const serviceExamples={
 'Laptop & computer repair':[estimate('Device diagnosis',299,'Illustrative inspection estimate; parts and repair are extra.'),estimate('Software setup / installation',499,'Illustrative labour estimate; licensing and parts are extra.')],
 'Mobile repair':[estimate('Phone diagnosis',149,'Illustrative inspection estimate; parts and repair are extra.'),estimate('Basic repair labour',499,'Illustrative labour starting estimate; model and fault change the quote.')],
 'Mobile & electronics repair':[estimate('Device diagnosis',149,'Illustrative inspection estimate; parts and repair are extra.'),estimate('Basic repair labour',499,'Illustrative labour starting estimate; model and fault change the quote.')],
 'Electronics repair':[estimate('Appliance diagnosis',199,'Illustrative inspection estimate; parts and repair are extra.'),estimate('Basic repair labour',399,'Illustrative labour starting estimate; appliance and fault change the quote.')],
 'Plumbing':[estimate('Local visit / inspection',149,'Illustrative starting visit estimate; parts and work are extra.'),estimate('Tap leak repair labour',299,'Illustrative labour estimate; parts and job conditions are extra.')],
 'Electrical & plumbing':[estimate('Local visit / inspection',149,'Illustrative starting visit estimate; parts and work are extra.'),estimate('Switch or socket replacement labour',199,'Illustrative labour estimate; parts and job conditions are extra.')],
 'Air conditioning':[estimate('AC cleaning / service',699,'Illustrative reference price per visit; confirm scope and current charge.'),estimate('AC installation labour',799,'Illustrative reference price; materials and unit handling may be extra.')],
 'Pest control':[estimate('Home inspection',299,'Illustrative inspection estimate; treatment quote depends on area and pest.'),estimate('1-bedroom home treatment',999,'Illustrative starting estimate; pest type and property size change the quote.')]
};

export async function seedWarangalDirectory(){
  const seedPassword=await bcrypt.hash(`${Date.now()}-${Math.random()}-${process.env.JWT_SECRET}`,12);
  const owner=await User.findOneAndUpdate({email:'directory@lifeloop.local'},{$setOnInsert:{name:'LifeLoop Public Directory',email:'directory@lifeloop.local',password:seedPassword,role:'admin',approved:true}},{upsert:true,new:true});
  for(const item of directoryBusinesses){
    const {products=[],slug,...business}=item;
    const row=await Business.findOneAndUpdate({slug},{$setOnInsert:{slug,owner:owner._id},$set:{...business,approved:true,verified:false,claimed:false,status:'unknown',location:business.location||{type:'Point',coordinates:[79.5941,17.9784]},locationApproximate:business.locationApproximate!==false}},{upsert:true,new:true});
    const offers=[...products,...(item.listingType==='shop'?shopExamples[item.category]||[]:(serviceExamples[item.category]||[]).map(p=>({...p,kind:'service'})))];
    if(!offers.length)offers.push(estimate(item.listingType==='shop'?'Current store catalogue':'Initial assessment',199,'Illustrative reference price only. Confirm the current price and availability directly.'));
    await Product.deleteMany({business:row._id,priceNote:'Contact provider to confirm'});
    for(const p of offers){
      const product={...p,business:row._id,sourceUrl:item.sourceUrl,availabilityConfirmedAt:undefined};
      await Product.updateOne({business:row._id,name:p.name},{$setOnInsert:product},{upsert:true});
    }
  }
}
